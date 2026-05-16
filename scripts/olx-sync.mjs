// OLX -> bintang_raya_motor website sync.
//
// 1. Scrape OLX (via Playwright + internal API).
// 2. Download every car's photos to public/images/olx-<id>/photo-N.jpg.
// 3. Compare against current src/data/cars.js (by olxId) — log adds / removes.
// 4. Generate a new src/data/cars.js from the OLX inventory.
// 5. Clean up image folders for cars that are gone.
//
// Run: node scripts/olx-sync.mjs

import { chromium } from "playwright";
import { writeFile, readFile, mkdir, rm, access } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const USER_ID = "60978918";
const PAGE_SIZE = 50;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "")), "..");
const IMG_DIR = path.join(ROOT, "public", "images");
const CARS_FILE = path.join(ROOT, "src", "data", "cars.js");

// ─── helpers ───────────────────────────────────────────────────────────────

const findParam = (params, key) => params?.find((p) => p.key === key);

function parseTax(description) {
  if (!description) return "—";
  const m = description.match(/[Pp]ajak\s+(?:on\s+(?:bln|bulan)\s+)?([A-Za-z]+\s+20\d{2})/);
  return m ? m[1] : "—";
}

function parseCreditPrice(description) {
  // Catches things like "OTR khusus kredit : 329 jt"
  const m = description?.match(/(?:khusus\s+kredit|kredit)\s*[:=]?\s*Rp?\s*([\d.,]+)\s*(jt|juta|rb|m)?/i);
  if (!m) return null;
  let n = parseFloat(m[1].replace(/[.,]/g, "")) || null;
  if (!n) return null;
  const unit = (m[2] || "").toLowerCase();
  if (unit === "jt" || unit === "juta") n = n * 1_000_000;
  else if (unit === "m") n = n * 1_000_000_000;
  else if (unit === "rb") n = n * 1_000;
  return n;
}

function formatRp(n) {
  if (!n) return null;
  return "Rp " + n.toLocaleString("id-ID");
}

function normalize(item) {
  const p = item.parameters || [];
  const brand = findParam(p, "make")?.value_name || "Unknown";
  const model = findParam(p, "m_tipe")?.value_name || "";
  const variant = findParam(p, "m_tipe_variant")?.value_name || "";
  const year = Number(findParam(p, "m_year")?.value_name) || 0;
  const transmission = findParam(p, "m_transmission")?.value_name || "—";
  const fuel = findParam(p, "m_fuel")?.value_name || "—";
  const mileage = findParam(p, "mileage")?.formatted_value || "—";
  const color = findParam(p, "m_color")?.value_name || null;
  const body = findParam(p, "m_body")?.value_name || null;

  const price = item.price?.value?.raw ?? 0;
  const priceCash = item.price?.value?.display ?? formatRp(price);
  const priceCredit = formatRp(parseCreditPrice(item.description));
  const tax = parseTax(item.description);

  return {
    olxId: item.id,
    name: item.title,
    brand,
    model,
    variant,
    year,
    price,
    priceCash,
    priceCredit,
    fuel,
    transmission,
    mileage,
    color,
    body,
    location: "Bandung (Plat D)",
    tax,
    description: item.description,
    olxUrl: `https://www.olx.co.id/item/iid-${item.id}`,
    rawImages: (item.images || []).map((img) => img.full?.url || img.url),
  };
}

// ─── 1. scrape ─────────────────────────────────────────────────────────────

async function scrape() {
  console.log("[1/5] Launching Chrome...");
  // Local Windows fails HTTP/2 negotiation with bundled Chromium for some
  // reason — use the installed Chrome. CI runners (Linux) don't have Chrome
  // installed but Playwright's bundled chromium works fine there.
  const useSystemChrome = !process.env.CI;
  const browser = await chromium.launch({
    headless: true,
    ...(useSystemChrome ? { channel: "chrome" } : {}),
    args: ["--disable-blink-features=AutomationControlled", "--no-sandbox"],
  });
  const ctx = await browser.newContext({
    locale: "id-ID",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await ctx.newPage();

  // Warm-up: pass Akamai.
  for (let i = 1; i <= 3; i++) {
    try {
      await page.goto("https://www.olx.co.id/", { waitUntil: "commit", timeout: 60000 });
      break;
    } catch (e) {
      console.log(`  warm-up retry ${i}: ${e.message.split("\n")[0]}`);
      if (i === 3) throw e;
      await page.waitForTimeout(2000);
    }
  }
  await page.waitForTimeout(2500);

  const all = [];
  let cursor = "";
  let pageNum = 0;
  while (true) {
    pageNum++;
    const url = `/api/v3/users/${USER_ID}/items?limit=${PAGE_SIZE}&status=ACTIVE${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
    console.log(`  page ${pageNum}: ${url}`);
    const j = await page.evaluate(async (u) => {
      const r = await fetch(u, { headers: { Accept: "application/json" } });
      return { status: r.status, body: r.ok ? await r.json() : await r.text() };
    }, url);
    if (j.status !== 200) throw new Error(`API ${j.status}: ${String(j.body).slice(0, 200)}`);
    const items = j.body.data || [];
    all.push(...items);
    const total = j.body.metadata?.total ?? 0;
    const nextCursor = j.body.metadata?.cursor;
    if (!nextCursor || items.length === 0 || all.length >= total) break;
    cursor = String(nextCursor);
    await page.waitForTimeout(500);
  }
  console.log(`  fetched ${all.length} listings`);

  await browser.close();
  return all.map(normalize);
}

// ─── 2. image download ─────────────────────────────────────────────────────

async function downloadImages(cars) {
  console.log(`[2/5] Downloading images to ${IMG_DIR}/olx-<id>/ ...`);
  await mkdir(IMG_DIR, { recursive: true });
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const car of cars) {
    const folder = path.join(IMG_DIR, `olx-${car.olxId}`);
    await mkdir(folder, { recursive: true });
    car.images = [];
    let idx = 1;
    for (const remoteUrl of car.rawImages) {
      const localName = `photo-${idx}.jpg`;
      const localPath = path.join(folder, localName);
      const webPath = `/images/olx-${car.olxId}/${localName}`;
      car.images.push(webPath);

      if (existsSync(localPath)) {
        skipped++;
      } else {
        try {
          const r = await fetch(remoteUrl);
          if (!r.ok) throw new Error("HTTP " + r.status);
          const buf = Buffer.from(await r.arrayBuffer());
          await writeFile(localPath, buf);
          downloaded++;
        } catch (e) {
          console.log(`    ! ${car.olxId} photo ${idx}: ${e.message}`);
          failed++;
        }
      }
      idx++;
    }
    car.image = car.images[0] || null;
    delete car.rawImages;
  }
  console.log(`  downloaded ${downloaded}, skipped ${skipped} (already on disk), failed ${failed}`);
}

// ─── 3. diff against existing cars.js ──────────────────────────────────────

async function readExistingOlxIds() {
  if (!existsSync(CARS_FILE)) return new Set();
  const src = await readFile(CARS_FILE, "utf8");
  const ids = new Set();
  // Existing cars.js doesn't have olxId yet. After first sync, every car
  // will have an olxId line we can parse.
  const re = /olxId:\s*["'](\d+)["']/g;
  let m;
  while ((m = re.exec(src))) ids.add(m[1]);
  return ids;
}

function diffSummary(cars, prevIds) {
  const newIds = new Set(cars.map((c) => c.olxId));
  const added = cars.filter((c) => !prevIds.has(c.olxId)).map((c) => c.olxId);
  const removed = [...prevIds].filter((id) => !newIds.has(id));
  return { added, removed, total: cars.length };
}

// ─── 4. emit cars.js ───────────────────────────────────────────────────────

function emitCarsJs(cars) {
  // Sort: newest listings first (preserve OLX order from API which is by created_at desc).
  // Mark the first 3 as featured.
  cars.forEach((c, i) => (c.isFeatured = i < 3));

  const body = cars
    .map((c, i) => {
      const imagesArr = c.images.map((p) => `      ${JSON.stringify(p)}`).join(",\n");
      return `  {
    id: ${i + 1},
    olxId: ${JSON.stringify(c.olxId)},
    name: ${JSON.stringify(c.name)},
    brand: ${JSON.stringify(c.brand)},
    model: ${JSON.stringify(c.model)},
    variant: ${JSON.stringify(c.variant)},
    year: ${c.year},
    price: ${c.price},
    priceCash: ${JSON.stringify(c.priceCash)},
    priceCredit: ${c.priceCredit ? JSON.stringify(c.priceCredit) : "null"},
    fuel: ${JSON.stringify(c.fuel)},
    transmission: ${JSON.stringify(c.transmission)},
    mileage: ${JSON.stringify(c.mileage)},
    color: ${c.color ? JSON.stringify(c.color) : "null"},
    body: ${c.body ? JSON.stringify(c.body) : "null"},
    location: ${JSON.stringify(c.location)},
    tax: ${JSON.stringify(c.tax)},
    description: ${JSON.stringify(c.description)},
    olxUrl: ${JSON.stringify(c.olxUrl)},
    image: ${JSON.stringify(c.image)},
    images: [
${imagesArr}
    ],
    isFeatured: ${c.isFeatured}
  }`;
    })
    .join(",\n");

  return `// AUTO-GENERATED by scripts/olx-sync.mjs — do not edit by hand.
// Last sync: ${new Date().toISOString()}
// Source: OLX profile https://www.olx.co.id/profile/${USER_ID}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const cars = [
${body}
];
`;
}

// ─── 5. cleanup image folders for removed cars ────────────────────────────

async function cleanupRemovedFolders(activeOlxIds) {
  const { readdir } = await import("node:fs/promises");
  let entries;
  try {
    entries = await readdir(IMG_DIR);
  } catch {
    return 0;
  }
  let removed = 0;
  for (const name of entries) {
    if (!name.startsWith("olx-")) continue; // leave non-OLX folders alone
    const id = name.slice(4);
    if (!activeOlxIds.has(id)) {
      await rm(path.join(IMG_DIR, name), { recursive: true, force: true });
      removed++;
    }
  }
  return removed;
}

// ─── main ──────────────────────────────────────────────────────────────────

async function main() {
  const cars = await scrape();
  await downloadImages(cars);

  console.log("[3/5] Diffing against existing cars.js...");
  const prevIds = await readExistingOlxIds();
  const diff = diffSummary(cars, prevIds);
  console.log(`  prev: ${prevIds.size}  ->  new: ${diff.total}`);
  console.log(`  added: ${diff.added.length}  removed: ${diff.removed.length}`);
  if (diff.added.length) console.log(`    + ${diff.added.slice(0, 10).join(", ")}${diff.added.length > 10 ? " ..." : ""}`);
  if (diff.removed.length) console.log(`    - ${diff.removed.slice(0, 10).join(", ")}${diff.removed.length > 10 ? " ..." : ""}`);

  console.log("[4/5] Writing src/data/cars.js...");
  const content = emitCarsJs(cars);
  await writeFile(CARS_FILE, content, "utf8");
  console.log(`  wrote ${(content.length / 1024).toFixed(1)} KB`);

  console.log("[5/5] Cleaning up old image folders...");
  const activeIds = new Set(cars.map((c) => c.olxId));
  const removedFolders = await cleanupRemovedFolders(activeIds);
  console.log(`  removed ${removedFolders} stale image folders`);

  console.log("\nDONE.");
  console.log(`  Total cars: ${cars.length}`);
  console.log(`  Added since last sync: ${diff.added.length}`);
  console.log(`  Removed since last sync: ${diff.removed.length}`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
