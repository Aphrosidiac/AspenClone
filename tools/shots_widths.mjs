import { chromium } from '/Users/fakhrul/Desktop/dev/Shoal/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const URL = process.argv[2], OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: '/Users/fakhrul/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
for (const [W, H] of [[320, 568], [768, 1024], [1024, 768], [1920, 1080]]) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(6500);
  const sh = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < sh; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600);
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(W, 'scrollHeight', sh, 'overflowX', ov);
  await page.screenshot({ path: `${OUT}/${W}_top.png` });
  for (const id of ['about', 'clients', 'testimonials', 'team']) { await page.evaluate((i) => document.getElementById(i).scrollIntoView(), id); await page.waitForTimeout(1200); await page.screenshot({ path: `${OUT}/${W}_${id}.png` }); }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(1200); await page.screenshot({ path: `${OUT}/${W}_footer.png` });
  await ctx.close();
}
await browser.close();
