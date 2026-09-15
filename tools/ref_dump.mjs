// Dump the reference site's hydrated DOM + screenshots at a given width.
import { chromium } from '/Users/fakhrul/Desktop/dev/Shoal/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const W = +(process.argv[2] || 1440), H = +(process.argv[3] || 900);
const OUT = 'docs/reference/2026-09-15';
const browser = await chromium.launch({ headless: true, executablePath: '/Users/fakhrul/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36' });
const page = await ctx.newPage();
await page.goto('https://www.aspensearch.com/', { waitUntil: 'networkidle' });
await page.waitForTimeout(6000);
// step-scroll to trigger reveals
const sh = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < sh; y += Math.round(H * 0.6)) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(250); }
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
const html = await page.evaluate(() => {
  const c = document.body.cloneNode(true);
  c.querySelectorAll('script,noscript,style').forEach(e => e.remove());
  c.querySelectorAll('img').forEach(i => { i.removeAttribute('srcset'); i.removeAttribute('sizes'); i.removeAttribute('loading'); i.removeAttribute('decoding'); const s = i.getAttribute('src') || ''; const m = s.match(/production\/([^?]+)/); if (m) i.setAttribute('src', 'sanity:' + m[1]); });
  c.querySelectorAll('[data-marqy-item][aria-hidden]').forEach(e => e.remove());
  // collapse split-lines wrappers back to text
  c.querySelectorAll('[data-split]').forEach(e => { const lines=[...e.querySelectorAll('[data-line]')].map(l=>l.textContent); if(lines.length){ e.textContent = lines.join(''); } });
  let h = c.outerHTML;
  h = h.replace(/data:image\/[a-z]+;base64,[A-Za-z0-9+\/=]+/g, 'DATAURI').replace(/ d="[^"]{80,}"/g, ' d="PATH"');
  return h;
});
fs.mkdirSync(`${OUT}/dom`, { recursive: true });
fs.writeFileSync(`${OUT}/dom/home_${W}.html`, html);
await page.screenshot({ path: `${OUT}/shots/home_${W}_full.png`, fullPage: true }).catch(async e => { fs.mkdirSync(`${OUT}/shots`, { recursive: true }); await page.screenshot({ path: `${OUT}/shots/home_${W}_full.png`, fullPage: true }); });
console.log('html bytes', html.length, 'scrollHeight', sh);
await browser.close();
