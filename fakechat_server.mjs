#!/usr/bin/env node
import { createServer } from 'node:http'
import { createHash, randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync, statSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, extname, basename } from 'node:path'

const PORT = Number(process.env.FAKECHAT_PORT ?? 8787)
const STATE_DIR = join(homedir(), '.claude', 'channels', 'fakechat')
const INBOX_DIR = join(STATE_DIR, 'inbox')
const OUTBOX_DIR = join(STATE_DIR, 'outbox')

let seq = 0
function nextId() { return `m${Date.now()}-${++seq}` }

const clients = new Set()

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf', '.txt': 'text/plain',
}

function deliver(id, text, file) {
  // Store user message to be picked up by the Claude session
  // For standalone mode, we just echo it back as delivered
  process.stderr.write(`fakechat: message ${id}: ${text?.trim() || '(file)'}\n`)
}

function sendMessage(m) {
  const data = JSON.stringify(m)
  for (const [_, ws] of clients) {
    try { _sendFrame(ws, data) } catch { /* client gone */ }
  }
}

// ---- minimal WebSocket handling on a raw TCP socket ----
const WS_GUID = '258EAFA5-E914-47DA-95CA-5AB3C1B84D'

function _sendFrame(sock, payload) {
  const buf = Buffer.from(payload, 'utf8')
  const len = buf.length
  let header
  if (len < 126) {
    header = Buffer.alloc(2)
    header[0] = 0x81  // FIN + text
    header[1] = len
  } else if (len < 65536) {
    header = Buffer.alloc(4)
    header[0] = 0x81; header[1] = 126
    header.writeUInt16BE(len, 2)
  } else {
    header = Buffer.alloc(10)
    header[0] = 0x81; header[1] = 127
    header.writeBigUInt64BE(BigInt(len), 2)
  }
  sock.write(Buffer.concat([header, buf]))
}

function handleWS(req, sock) {
  const key = req.headers['sec-websocket-key']
  if (!key) { sock.destroy(); return }

  const accept = createHash('sha1').update(key + WS_GUID).digest('base64')
  sock.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\nConnection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  )

  clients.add(sock)
  let buf = Buffer.alloc(0)

  sock.on('data', chunk => {
    buf = Buffer.concat([buf, chunk])
    while (buf.length >= 2) {
      const lenByte = buf[1] & 0x7F
      let offset = 2
      let payloadLen = lenByte
      if (lenByte === 126) {
        if (buf.length < 4) break
        payloadLen = buf.readUInt16BE(2)
        offset = 4
      } else if (lenByte === 127) {
        if (buf.length < 10) break
        payloadLen = Number(buf.readBigUInt64BE(2))
        offset = 10
      }
      // client frames are always masked
      if (!(buf[1] & 0x80)) { buf = buf.slice(offset + payloadLen); continue }
      if (buf.length < offset + 4 + payloadLen) break
      const mask = buf.slice(offset, offset + 4)
      const raw = buf.slice(offset + 4, offset + 4 + payloadLen)
      const unmasked = Buffer.from(raw)
      for (let i = 0; i < raw.length; i++) unmasked[i] = raw[i] ^ mask[i % 4]
      buf = buf.slice(offset + 4 + payloadLen)

      try {
        const parsed = JSON.parse(unmasked.toString('utf8'))
        const fileItem = pendingFiles.get(parsed.id)
        deliver(parsed.id, parsed.text || '', fileItem)
        // Echo user message back as assistant so they see it
        sendMessage({ type: 'msg', id: parsed.id, from: 'user', text: parsed.text, ts: Date.now() })
        if (fileItem) {
          // file already handled
        }
      } catch { /* ignore */ }
    }
  })

  sock.on('close', () => { clients.delete(sock) })
  sock.on('end', () => { clients.delete(sock) })
}

const pendingFiles = new Map()

function parseWSRequest(req, sock) {
  const key = req.headers['sec-websocket-key']
  if (!key) return false
  handleWS(req, sock)
  return true
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname === '/ws') {
    // Upgrade — handled in 'upgrade' listener
    req.socket.destroy()
    return
  }

  if (url.pathname.startsWith('/files/')) {
    const f = url.pathname.slice(7)
    if (f.includes('..') || f.includes('/')) { res.writeHead(400).end('bad'); return }
    try {
      const data = readFileSync(join(OUTBOX_DIR, f))
      const ext = extname(f).toLowerCase()
      res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream' })
      res.end(data)
    } catch { res.writeHead(404).end('404') }
    return
  }

  if (url.pathname === '/upload' && req.method === 'POST') {
    let body = Buffer.alloc(0)
    req.on('data', chunk => { body = Buffer.concat([body, chunk]) })
    req.on('end', () => {
      const boundary = _extractBoundary(req.headers['content-type'])
      if (!boundary) { res.writeHead(400).end('bad'); return }
      const form = _parseFormData(body, boundary)
      const id = form['id'] || ''
      const text = form['text'] || ''
      const fPart = form['file']
      let file = undefined
      if (fPart?.data?.length > 0) {
        mkdirSync(INBOX_DIR, { recursive: true })
        const ext = extname(fPart.name).toLowerCase() || '.bin'
        const fpath = join(INBOX_DIR, `${Date.now()}${ext}`)
        writeFileSync(fpath, fPart.data)
        file = { path: fpath, name: fPart.name }
        pendingFiles.set(id, file)
      }
      deliver(id, text, file)
      sendMessage({ type: 'msg', id, from: 'user', text, ts: Date.now(),
        file: file ? { url: URL.createObjectURL ? '' : `/files/${basename(file.path)}`, name: file.name } : undefined
      })
      res.writeHead(204).end()
    })
    return
  }

  if (url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(HTML)
    return
  }
  res.writeHead(404).end('404')
})

server.on('upgrade', (req, sock) => {
  // Don't send HTTP response on upgrade — parseWS handles it
  if (req.url === '/ws') {
    if (!parseWSRequest(req, sock)) sock.destroy()
  } else {
    sock.destroy()
  }
})

server.listen(PORT, '127.0.0.0', () => {
  process.stderr.write(`fakechat: http://localhost:${PORT}\n`)
})
server.listen(PORT, '127.0.0.1', () => {}).on('error', e => {})

// ---- minimal multipart parser ----
function _extractBoundary(ct) {
  if (!ct) return null
  const m = ct.match(/boundary="?([^";\s]+)"?/)
  return m ? m[1] : null
}

function _parseFormData(buf, boundary) {
  const str = buf.toString('utf8')
  const parts = str.split('--' + boundary)
  const result = {}
  for (const part of parts) {
    if (!part.trim() || part.startsWith('--')) continue
    const headerEnd = part.indexOf('\r\n\r\n')
    if (headerEnd === -1) continue
    const headers = part.slice(0, headerEnd)
    const body = part.slice(headerEnd + 4).replace(/\r?\n--$/, '').replace(/\r?\n--\r?\n$/, '')
    const nameMatch = headers.match(/name="([^"]+)"/)
    const filenameMatch = headers.match(/filename="([^"]+)"/)
    if (!nameMatch) continue
    const name = nameMatch[1]
    if (filenameMatch) {
      result[name] = { name: filenameMatch[1], data: Buffer.from(body, 'binary') }
    } else {
      result[name] = body.replace(/\r?\n$/, '')
    }
  }
  return result
}

const HTML = `<!doctype html>
<meta charset="utf-8">
<title>fakechat</title>
<style>
body { font-family: monospace; margin: 0; padding: 1em 1em 7em; }
#log { white-space: pre-wrap; word-break: break-word; }
form { position: fixed; bottom: 0; left: 0; right: 0; padding: 1em; background: #fff; }
#text { width: 100%; box-sizing: border-box; font: inherit; margin-bottom: 0.5em; }
#file { display: none; }
#row { display: flex; gap: 1ch; }
#row button[type=submit] { margin-left: auto; }
</style>
<h3>fakechat</h3>
<pre id=log></pre>
<form id=form>
  <textarea id=text rows=2 autocomplete=off autofocus></textarea>
  <div id=row>
    <button type=button onclick="file.click()">attach</button><input type=file id=file>
    <span id=chip></span>
    <button type=submit>send</button>
  </div>
</form>

<script>
const log = document.getElementById('log')
document.getElementById('file').onchange = e => { const f = e.target.files[0]; chip.textContent = f ? '[' + f.name + ']' : '' }
const form = document.getElementById('form')
const input = document.getElementById('text')
const fileIn = document.getElementById('file')
const chip = document.getElementById('chip')
const msgs = {}

const ws = new WebSocket('ws://' + location.host + '/ws')
ws.onmessage = e => {
  const m = JSON.parse(e.data)
  if (m.type === 'msg') add(m)
  if (m.type === 'edit') { const x = msgs[m.id]; if (x) { x.body.textContent = m.text + ' (edited)' } }
}

let uid = 0
form.onsubmit = e => {
  e.preventDefault()
  const text = input.value.trim()
  const file = fileIn.files[0]
  if (!text && !file) return
  input.value = ''; fileIn.value = ''; chip.textContent = ''
  const id = 'u' + Date.now() + '-' + (++uid)
  add({ id, from: 'user', text, file: file ? { url: '', name: file.name } : undefined })
  if (file) {
    const fd = new FormData(); fd.set('id', id); fd.set('text', text); fd.set('file', file)
    fetch('/upload', { method: 'POST', body: fd })
  } else {
    ws.send(JSON.stringify({ id, text }))
  }
}

function add(m) {
  const who = m.from === 'user' ? 'you' : 'bot'
  const el = line(who, m.text, m.replyTo, m.file)
  log.appendChild(el); scroll()
  msgs[m.id] = { body: el.querySelector('.body') }
}

function line(who, text, replyTo, file) {
  const div = document.createElement('div')
  const t = new Date().toTimeString().slice(0, 8)
  const reply = replyTo && msgs[replyTo] ? ' ↳ ' + (msgs[replyTo].body.textContent || '(file)').slice(0, 40) : ''
  div.innerHTML = '[' + t + '] <b>' + who + '</b>' + reply + ': <span class=body></span>'
  const body = div.querySelector('.body')
  body.textContent = text || ''
  if (file) {
    const indent = 11 + who.length + 2
    if (text) body.appendChild(document.createTextNode('\\n' + ' '.repeat(indent)))
    const a = document.createElement('a')
    a.href = file.url || '#'; a.download = file.name; a.textContent = '[' + file.name + ']'
    body.appendChild(a)
  }
  return div
}

function scroll() { window.scrollTo(0, document.body.scrollHeight) }
input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit() } })
</script>
`
