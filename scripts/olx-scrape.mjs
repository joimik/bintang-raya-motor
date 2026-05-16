// OLX scraper — fetches all active listings for a profile via the internal
// JSON API. Uses Playwright once to pass the Akamai bot challenge, then calls
// /api/v3/users/{id}/items repeatedly with cursor pagination.
//
// Run: node scripts/olx-scrape.mjs

import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const USER_ID = "60978918";
const PAGE_SIZE = 50;
const OUT_RAW = "scripts/olx-raw.json";
const OUT_NORMALIZED = "scripts/olx-listings.json";

async function gotoRetry(page, url, attempts = 3) {
  let err;
  for (let i = 1; i <= attempts; i++) {
    try {
      await page.goto(url, { waitUntil: "commit", timeout: 60000 });
      return;
    } catch (e) {
      err = e;
      console.log(`  goto retry ${i}: ${e.message.split("\n")[0]}`);
      await page.waitForTimeout(2000);
    }
  }
  throw err;
}

function findParam(parameters, key) {
  return parameters?.find((p) => p.key === key);
}

// Convert one OLX API item into the shape used by src/data/cars.js.
function normalize(item) {
  const p = item.parameters || [];
  const brand = findParam(p, "make")?.value_name || null;
  const model = findParam(p, "m_tipe")?.value_name || null;
  const variant = findParam(p, "m_tipe_variant")?.value_name || null;
  const year = Number(findParam(p, "m_year")?.value_name) || null;
  const transmission = findParam(p, "m_transmission")?.value_name || null;
  const fuel = findParam(p, "m_fuel")?.value_name || null;
  const mileage = findParam(p, "mileage")?.formatted_value || null;
  const color = findParam(p, "m_color")?.value_name || null;
  const body = findParam(p, "m_body")?.value_name || null;
  const engine = findParam(p, "m_engine_capacity")?.formatted_value || null;

  // Use full-size image URLs (1080x810).
  const images = (item.images || []).map((img) => img.full?.url || img.url);

  return {
    olxId: item.id,
    title: item.title,
    description: item.description,
    url: `https://www.olx.co.id/item/iid-${item.id}`,
    price: item.price?.value?.raw ?? null,
    priceDisplay: item.price?.value?.display ?? null,
    brand,
    model,
    variant,
    year,
    transmission,
    fuel,
    mileage,
    color,
    body,
    engine,
    location: item.locations?.[0] ?? null,
    images,
    imageCount: images.length,
    createdAt: item.created_at,
    validTo: item.valid_to,
    status: item.status?.display ?? null,
  };
}

async function main() {
  console.log("Launching Chrome...");
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
    args: ["--disable-blink-features=AutomationControlled", "--no-sandbox"],
  });
  const context = await browser.newContext({
    locale: "id-ID",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  console.log("Warm-up: loading homepage to pass Akamai...");
  await gotoRetry(page, "https://www.olx.co.id/");
  await page.waitForTimeout(2500);

  let all = [];
  let cursor = "";
  let meta = null;
  let pageNum = 0;

  while (true) {
    pageNum++;
    const apiUrl = `/api/v3/users/${USER_ID}/items?limit=${PAGE_SIZE}&status=ACTIVE${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
    console.log(`Page ${pageNum}: GET ${apiUrl}`);

    const json = await page.evaluate(async (u) => {
      const r = await fetch(u, { headers: { Accept: "application/json" } });
      return { status: r.status, body: r.ok ? await r.json() : await r.text() };
    }, apiUrl);

    if (json.status !== 200) {
      console.error(`  status ${json.status}, body:`, String(json.body).slice(0, 300));
      break;
    }

    const items = json.body.data || [];
    console.log(`  -> ${items.length} items`);
    all.push(...items);

    meta = json.body.metadata;
    const nextCursor = meta?.cursor;
    if (!nextCursor || items.length === 0) break;
    if (Number(nextCursor) <= all.length && pageNum >= 1 && all.length >= (meta?.total || 0)) break;
    cursor = String(nextCursor);

    await page.waitForTimeout(800);
  }

  const total = meta?.total ?? all.length;
  console.log(`\nFetched ${all.length} / ${total} listings.`);

  await writeFile(OUT_RAW, JSON.stringify({ scrapedAt: new Date().toISOString(), total, items: all }, null, 2));
  console.log(`Raw  -> ${OUT_RAW} (${(JSON.stringify(all).length / 1024).toFixed(1)} KB)`);

  const normalized = all.map(normalize);
  await writeFile(
    OUT_NORMALIZED,
    JSON.stringify({ scrapedAt: new Date().toISOString(), count: normalized.length, listings: normalized }, null, 2)
  );
  console.log(`Norm -> ${OUT_NORMALIZED}`);

  // Quick summary
  console.log("\nSample (first 5):");
  for (const c of normalized.slice(0, 5)) {
    console.log(`  [${c.olxId}] ${c.brand} ${c.model} ${c.year} — ${c.priceDisplay} (${c.imageCount} photos)`);
  }
  console.log("\nBrands:");
  const brands = {};
  normalized.forEach((c) => (brands[c.brand || "?"] = (brands[c.brand || "?"] || 0) + 1));
  Object.entries(brands)
    .sort((a, b) => b[1] - a[1])
    .forEach(([b, n]) => console.log(`  ${b}: ${n}`));

  await browser.close();
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
