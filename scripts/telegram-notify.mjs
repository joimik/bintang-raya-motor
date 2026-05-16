// Telegram bot notifier for OLX sync — sends one message per added/removed car.
//
// Reads:
//   TELEGRAM_BOT_TOKEN  — bot API token (GitHub secret)
//   TELEGRAM_CHAT_ID    — chat to message (user's private chat ID)
//
// If either env var is missing, all functions become silent no-ops so local
// runs of olx-sync.mjs don't fail.

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ENABLED = Boolean(TOKEN && CHAT_ID);
const API = TOKEN ? `https://api.telegram.org/bot${TOKEN}` : null;

function fmtRp(n) {
  if (!n) return "—";
  return "Rp " + n.toLocaleString("id-ID");
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function trimDesc(s, max = 600) {
  if (!s) return "";
  const t = s.trim();
  return t.length > max ? t.slice(0, max).trimEnd() + "…" : t;
}

async function call(method, payload) {
  if (!ENABLED) return null;
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, ...payload }),
  });
  const body = await res.json();
  if (!body.ok) console.log(`  Telegram ${method} failed: ${body.description}`);
  return body;
}

// ─── public API ────────────────────────────────────────────────────────────

export function isEnabled() {
  return ENABLED;
}

export async function sendSummary({ added, removed, total }) {
  if (!ENABLED) return;
  const headline =
    added === 0 && removed === 0
      ? "✅ <b>Sync harian: tidak ada perubahan</b>"
      : `🔔 <b>Sync harian Bintang Motor</b>\n📥 ${added} mobil baru · 📤 ${removed} mobil terjual/hilang · Total: ${total}`;
  await call("sendMessage", { text: headline, parse_mode: "HTML", disable_web_page_preview: true });
}

export async function sendAddedCar(car) {
  if (!ENABLED) return;
  const caption =
    `📥 <b>MOBIL BARU MASUK</b>\n` +
    `\n` +
    `<b>${escapeHtml(car.name)}</b>\n` +
    `\n` +
    `💰 <b>Harga:</b> ${escapeHtml(car.priceCash || fmtRp(car.price))}` +
    (car.priceCredit ? ` (kredit ${escapeHtml(car.priceCredit)})` : "") +
    `\n` +
    `📅 <b>Tahun:</b> ${car.year || "—"}\n` +
    `⚙️ <b>Transmisi:</b> ${escapeHtml(car.transmission || "—")}\n` +
    `⛽ <b>Bahan bakar:</b> ${escapeHtml(car.fuel || "—")}\n` +
    `🛣️ <b>KM:</b> ${escapeHtml(car.mileage || "—")}\n` +
    `🎨 <b>Warna:</b> ${escapeHtml(car.color || "—")}\n` +
    `📋 <b>Pajak:</b> ${escapeHtml(car.tax || "—")}\n` +
    `\n` +
    `<i>${escapeHtml(trimDesc(car.description, 400))}</i>\n` +
    `\n` +
    `🔗 <a href="${escapeHtml(car.olxUrl || "")}">Lihat di OLX</a>`;

  // Try to attach the first photo via its remote OLX URL (works during the
  // sync window — OLX serves these for the lifetime of the listing).
  const photo = car._remoteThumb;
  if (photo) {
    const r = await call("sendPhoto", { photo, caption, parse_mode: "HTML" });
    if (r?.ok) return;
    // Fall through to text-only if photo upload failed.
  }
  await call("sendMessage", { text: caption, parse_mode: "HTML", disable_web_page_preview: false });
}

export async function sendRemovedCar(prev) {
  if (!ENABLED) return;
  const text =
    `📤 <b>MOBIL TERJUAL / DIHAPUS</b>\n` +
    `\n` +
    `<b>${escapeHtml(prev.name)}</b>\n` +
    `\n` +
    `💰 ${escapeHtml(prev.priceCash || fmtRp(prev.price))}\n` +
    `📅 Tahun ${prev.year || "—"}\n` +
    `🆔 OLX ID: <code>${escapeHtml(prev.olxId)}</code>\n` +
    `\n` +
    `<i>Iklan ini sudah tidak ada di profil OLX — otomatis dihapus dari website.</i>`;
  await call("sendMessage", { text, parse_mode: "HTML", disable_web_page_preview: true });
}

export async function sendError(message) {
  if (!ENABLED) return;
  await call("sendMessage", {
    text: `⚠️ <b>Sync OLX gagal</b>\n<pre>${escapeHtml(String(message).slice(0, 1500))}</pre>`,
    parse_mode: "HTML",
  });
}
