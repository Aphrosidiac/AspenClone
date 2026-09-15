// Functional pass: drives the build headlessly and asserts DOM state. node tools/functional.mjs [url]
import { chromium } from '/Users/fakhrul/Desktop/dev/Shoal/node_modules/playwright/index.mjs';
const URL = process.argv[2] || 'http://localhost:3158/';
const browser = await chromium.launch({ headless: true, executablePath: '/Users/fakhrul/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
const results = [];
const check = (name, ok, info = '') => { results.push([name, ok]); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${info ? ' — ' + info : ''}`) };
async function desktop() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) });
  await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(7000);
  check('no console errors on load', errors.length === 0, errors.slice(0, 3).join(' | '));
  check('entrance overlay gone', !(await page.$('.z-3.bg-black')));
  check('h1 visible', (await page.$eval('h1 [data-line]', (e) => getComputedStyle(e).opacity)) === '1');
  check('no horizontal overflow', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  // contact modal
  await page.click('header button:has-text("Contact")'); await page.waitForTimeout(1500);
  check('contact modal opens + url', !!(await page.$('[data-modal=contact]')) && page.url().includes('modal=contact'));
  check('contact: focus inside dialog', await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]')));
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
  check('contact modal closes on Escape', !(await page.$('[data-modal=contact]')) && !page.url().includes('modal='));
  await page.click('header button:has-text("Contact")'); await page.waitForTimeout(1500);
  await page.mouse.click(200, 450); await page.waitForTimeout(1500);
  check('contact modal closes on backdrop', !(await page.$('[data-modal=contact]')));
  // copy button
  await page.click('header button:has-text("Contact")'); await page.waitForTimeout(1500);
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await page.click('[data-modal=contact] button[aria-label="Copy to clipboard"]'); await page.waitForTimeout(700);
  check('copy button shows check', (await page.$eval('[data-modal=contact] button[aria-label="Copy to clipboard"] path[style]', (e) => e.style.opacity)) === '1');
  // upload: set a file
  const input = await page.$('[data-modal=contact] input[type=file]');
  await input.setInputFiles({ name: 'cv.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') }); await page.waitForTimeout(300);
  check('upload accepts pdf', (await page.textContent('[data-modal=contact] form button span')).includes('cv.pdf'));
  await input.setInputFiles({ name: 'cv.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('x') }); await page.waitForTimeout(300);
  check('upload rejects exe', (await page.textContent('[data-modal=contact] form button span')).includes('PDF, DOC or TXT'));
  await input.setInputFiles({ name: 'big.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(6 * 1024 * 1024) }); await page.waitForTimeout(300);
  check('upload rejects >5MB', (await page.textContent('[data-modal=contact] form button span')).includes('5MB'));
  await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
  // deep link
  await page.goto(URL + '?modal=contact', { waitUntil: 'networkidle' }); await page.waitForTimeout(6500);
  check('deep link ?modal=contact opens', !!(await page.$('[data-modal=contact]')));
  await page.goBack(); await page.waitForTimeout(1200);
  await page.goto(URL + 'privacy-policy', { waitUntil: 'networkidle' }).catch(() => {}); await page.waitForTimeout(6500);
  check('/privacy-policy opens privacy modal', !!(await page.$('[data-modal=privacyPolicy]')));
  await page.goto(URL + 'nope', { waitUntil: 'networkidle' }).catch(() => {}); await page.waitForTimeout(2500);
  check('unknown path renders 404', (await page.textContent('main')).includes('Page Not Found'), (await page.textContent('main')).slice(0, 80));
  await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(7000);
  // anchor nav
  await page.click('header a[href="/#clients"]:visible'); await page.waitForTimeout(2200);
  const clientsTop = await page.$eval('#clients', (e) => Math.round(e.getBoundingClientRect().top));
  check('nav link scrolls #clients under header', Math.abs(clientsTop - 60) <= 2, `top=${clientsTop}`);
  // clients hover
  await page.hover('ul[aria-label="Clients"] li:nth-child(3) button'); await page.waitForTimeout(1000);
  check('client hover updates counter', (await page.textContent('#clients .tabular-nums .sr-only')) === '03');
  // testimonials
  await page.evaluate(() => document.querySelector('#testimonials').scrollIntoView()); await page.waitForTimeout(1500);
  const name0 = await page.textContent('#testimonials div.hidden.lg\\:grid .mt-auto p');
  await page.click('#testimonials div.hidden.lg\\:grid button[aria-label="Next testimonial"]'); await page.waitForTimeout(900);
  const name1 = await page.textContent('#testimonials div.hidden.lg\\:grid .mt-auto p');
  check('testimonial next changes item', name0 !== name1, `${name0} -> ${name1}`);
  await page.click('#testimonials div.hidden.lg\\:grid button[aria-label="Previous testimonial"]'); await page.waitForTimeout(1500);
  check('testimonial prev returns', (await page.textContent('#testimonials div.hidden.lg\\:grid .mt-auto p')) === name0);
  // team slider
  await page.evaluate(() => document.querySelector('#team').scrollIntoView()); await page.waitForTimeout(1500);
  const sl0 = await page.$eval('#team [style*="--card-basis"]', (e) => e.scrollLeft);
  await page.click('button[aria-label="Next team members"]'); await page.waitForTimeout(1200);
  const sl1 = await page.$eval('#team [style*="--card-basis"]', (e) => e.scrollLeft);
  check('team next scrolls slider', sl1 > sl0, `${sl0} -> ${sl1}`);
  check('team prev enabled after scroll', !(await page.$eval('button[aria-label="Previous team members"]', (b) => b.disabled)));
  await page.click('button[aria-label="Lira Aptekman"]'); await page.waitForTimeout(1500);
  check('team modal opens', !!(await page.$('[data-modal=lira-aptekman]')));
  check('team modal has bio + calendly', (await page.textContent('[data-modal=lira-aptekman]')).includes('Bio') && !!(await page.$('[data-modal=lira-aptekman] a[href*="calendly"]')));
  await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
  // theme
  await page.click('header button[aria-label="Toggle theme"]'); await page.waitForTimeout(1800);
  check('theme toggles to dark + persists', (await page.evaluate(() => document.documentElement.dataset.theme + ':' + localStorage.getItem('theme'))) === 'dark:dark');
  await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(6500);
  check('dark theme survives reload', (await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark');
  await page.click('header button[aria-label="Toggle theme"]'); await page.waitForTimeout(1800);
  // footer links
  check('footer privacy button', !!(await page.$('footer button:has-text("Privacy Policy")')));
  check('all images have alt attr', await page.$$eval('img', (els) => els.every((i) => i.hasAttribute('alt'))));
  check('landmarks', await page.evaluate(() => !!document.querySelector('header') && !!document.querySelector('main') && !!document.querySelector('footer') && document.querySelectorAll('h1').length === 2));
  // keyboard: tab reaches nav + contact
  await page.evaluate(() => window.scrollTo(0, 0)); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(200);
  check('keyboard focus mode set', await page.evaluate(() => document.documentElement.hasAttribute('data-keyboard-focus')));
  check('no console errors during pass', errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
async function mobile() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(7000);
  check('mobile: no horizontal overflow', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), await page.evaluate(() => document.documentElement.scrollWidth + ' vs ' + innerWidth));
  await page.click('header button[aria-controls]'); await page.waitForTimeout(1300);
  check('mobile menu opens', !!(await page.$('[role=dialog][aria-label="Site navigation"]')));
  await page.click('[role=dialog][aria-label="Site navigation"] a[href="/#team"]'); await page.waitForTimeout(2500);
  check('mobile menu link closes + scrolls', !(await page.$('[role=dialog][aria-label="Site navigation"]')) && (await page.$eval('#team', (e) => e.getBoundingClientRect().top)) < 200);
  await page.click('header button[aria-controls]'); await page.waitForTimeout(1300);
  await page.click('[role=dialog][aria-label="Site navigation"] button:has-text("Contact")'); await page.waitForTimeout(1500);
  check('mobile menu contact opens modal', !!(await page.$('[data-modal=contact]')));
  await page.click('button[aria-label="Close Contact dialog"]'); await page.waitForTimeout(1300);
  check('mobile close button closes modal', !(await page.$('[data-modal=contact]')));
  check('mobile: no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
await desktop(); await mobile();
await browser.close();
const fails = results.filter((r) => !r[1]).length;
console.log(`\n${results.length - fails}/${results.length} passed`);
