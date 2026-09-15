// Generic probe runner: node tools/ref_probe.mjs <script.js> [width] [height]
import { chromium } from '/Users/fakhrul/Desktop/dev/Shoal/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const script = fs.readFileSync(process.argv[2], 'utf8');
const W = +(process.argv[3] || 1440), H = +(process.argv[4] || 900);
const browser = await chromium.launch({ headless: true, executablePath: '/Users/fakhrul/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('console', m => { if (m.text().startsWith('PROBE')) console.log(m.text()); });
globalThis.page = page; globalThis.fs = fs;
await page.goto(process.env.URL || 'https://www.aspensearch.com/', { waitUntil: 'commit' });
const fn = new Function('page','fs','return (async()=>{'+script+'})()');
await fn(page, fs);
await browser.close();
