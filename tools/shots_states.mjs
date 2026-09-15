// Screenshots of interactive states: modals, menu, dark theme, hover. node tools/shots_states.mjs <url> <outdir>
import { chromium } from '/Users/fakhrul/Desktop/dev/Shoal/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const URL = process.argv[2], OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: '/Users/fakhrul/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
async function run(W, H, tag, steps) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(6500);
  for (const [name, fn] of steps) { try { await fn(page) } catch (e) { console.log('step failed', name, e.message.split('\n')[0]) } await page.waitForTimeout(2200); await page.screenshot({ path: `${OUT}/${tag}_${name}.png` }); }
  await ctx.close();
}
const esc = async (p) => { await p.keyboard.press('Escape'); await p.waitForTimeout(1300) }
await run(1440, 900, 'd', [
  ['contact', async (p) => p.click('header button:has-text("Contact")')],
  ['contact_scrolled', async (p) => p.mouse.wheel(0, 600)],
  ['team_ben', async (p) => { await esc(p); await p.evaluate(() => document.querySelector('#team').scrollIntoView()); await p.waitForTimeout(1500); await p.click('button[aria-label="Ben Herman"]') }],
  ['team_ben_scrolled', async (p) => p.mouse.wheel(0, 700)],
  ['privacy', async (p) => { await esc(p); await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(1500); await p.click('footer button:has-text("Privacy Policy")') }],
  ['dark', async (p) => { await esc(p); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800); await p.click('header button[aria-label="Toggle theme"]'); await p.waitForTimeout(1500) }],
  ['dark_clients', async (p) => { await p.evaluate(() => document.querySelector('#clients').scrollIntoView()); await p.waitForTimeout(1200); await p.hover('ul[aria-label="Clients"] li:nth-child(3) button') }],
  ['dark_footer', async (p) => { await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(800); await p.hover('footer button.group') }],
]);
await run(390, 844, 'm', [
  ['menu', async (p) => p.click('header button[aria-controls]')],
  ['contact', async (p) => { await p.click('#' + (await p.getAttribute('header button[aria-controls]', 'aria-controls')).replace(/[^a-zA-Z0-9_-]/g, '\\$&') + ' button'); }],
  ['team_ben', async (p) => { await esc(p); await p.evaluate(() => document.querySelector('#team').scrollIntoView()); await p.waitForTimeout(1500); await p.click('button[aria-label="Ben Herman"]') }],
]);
await browser.close();
