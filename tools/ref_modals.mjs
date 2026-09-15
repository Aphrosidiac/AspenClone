import { chromium } from '/Users/fakhrul/Desktop/dev/Shoal/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const OUT = 'docs/reference/2026-09-15';
const EXTRACT = fs.readFileSync('/Users/fakhrul/.claude/skills/reference-clone/scripts/extract_tokens.js','utf8');
const browser = await chromium.launch({ headless: true, executablePath: '/Users/fakhrul/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
const clean = () => {
  const c = document.body.cloneNode(true);
  c.querySelectorAll('script,noscript,style,main,header,footer').forEach(e => e.remove());
  c.querySelectorAll('img').forEach(i => { i.removeAttribute('srcset'); i.removeAttribute('sizes'); i.removeAttribute('loading'); i.removeAttribute('decoding'); const s = i.getAttribute('src') || ''; const m = s.match(/production\/([^?]+)/); if (m) i.setAttribute('src', 'sanity:' + m[1]); });
  c.querySelectorAll('[data-split]').forEach(e => { const lines=[...e.querySelectorAll('[data-line]')].map(l=>l.textContent); if(lines.length){ e.textContent = lines.join(''); } });
  c.querySelectorAll('div.pointer-events-none.fixed.inset-0.isolate.z-10[inert]').forEach(e=>e.remove());
  let h = c.outerHTML;
  h = h.replace(/data:image\/[a-z]+;base64,[A-Za-z0-9+\/=]+/g, 'DATAURI').replace(/ d="[^"]{80,}"/g, ' d="PATH"').replace(/ style="--desired-width[^"]*"/g,'');
  return h;
};
async function dumpModal(page, name, opener) {
  await opener();
  await page.waitForTimeout(2500);
  const html = await page.evaluate(clean);
  fs.writeFileSync(`${OUT}/dom/modal_${name}.html`, html);
  await page.screenshot({ path: `${OUT}/shots/modal_${name}.png` });
  console.log(name, html.length);
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
}
for (const [W,H] of [[1440,900],[390,844]]) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('https://www.aspensearch.com/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000);
  if (W === 1440) {
    await dumpModal(page, 'contact', async () => page.click('header button:has-text("Contact")'));
    await dumpModal(page, 'team_ben', async () => { await page.evaluate(()=>document.querySelector('#team')?.scrollIntoView()); await page.waitForTimeout(1500); await page.click('button[aria-label="Ben Herman"]'); });
    await dumpModal(page, 'privacy', async () => { await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await page.waitForTimeout(1500); await page.click('footer button:has-text("Privacy Policy")'); });
    await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(500);
  } else {
    const sh = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < sh; y += 500) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(200); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/shots/home_390_full.png`, fullPage: true });
    await dumpModal(page, 'menu_mobile', async () => page.click('header button[aria-controls]'));
  }
  const tokens = await page.evaluate(EXTRACT);
  fs.mkdirSync(`${OUT}/tokens`, { recursive: true });
  fs.writeFileSync(`${OUT}/tokens/home_${W}.json`, JSON.stringify(tokens, null, 1));
  console.log('tokens', W, JSON.stringify(tokens.meta||{}).slice(0,200));
  await ctx.close();
}
await browser.close();
