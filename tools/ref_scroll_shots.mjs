import { chromium } from '/Users/fakhrul/Desktop/dev/Shoal/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const URL = process.argv[2] || 'https://www.aspensearch.com/';
const W = +(process.argv[3] || 1440), H = +(process.argv[4] || 900);
const OUT = process.argv[5] || 'docs/reference/2026-09-15/shots/scroll_1440';
const STEP = +(process.argv[6] || H);
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: '/Users/fakhrul/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(6000);
const sh = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < sh; y += STEP) {
  await page.evaluate(v => window.scrollTo(0, v), y);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${String(i).padStart(2,'0')}_${y}.png` });
  i++;
}
console.log('shots', i, 'scrollHeight', sh);
await browser.close();
