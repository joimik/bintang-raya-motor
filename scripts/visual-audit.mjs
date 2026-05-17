// Take desktop + mobile screenshots of every key page for visual audit.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const PORT = 5173;
const BASE = `http://localhost:${PORT}`;

const browser = await chromium.launch({ headless: true, channel: "chrome" });
await mkdir("scripts/audit", { recursive: true });

async function shoot(label, url, viewport) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(500); // settle
  const path = `scripts/audit/${label}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`  ${label} -> ${path}`);
  await ctx.close();
}

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

for (const [name, vp] of [
  ["home-desktop", desktop],
  ["home-mobile", mobile],
  ["listings-desktop", desktop],
  ["listings-mobile", mobile],
  ["detail-desktop", desktop],
  ["detail-mobile", mobile],
]) {
  const route =
    name.startsWith("home") ? "/" :
    name.startsWith("listings") ? "/mobil" :
    "/mobil/1";
  await shoot(name, BASE + route, name.endsWith("mobile") ? mobile : desktop);
}

await browser.close();
console.log("done");
