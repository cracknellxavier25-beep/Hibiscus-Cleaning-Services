/**
 * Browser checks for the built site.
 *
 *   npm run test:e2e
 *
 * Builds two variants:
 *   dist/          production (form delivery not configured → call/text fallback)
 *   dist-preview/  PUBLIC_FORM_PREVIEW=true (form UI, explicit "not sent" result)
 *   dist-endpoint/ endpoint provider pointed at a mocked URL (success/error paths)
 * then serves each on a local port and drives Chromium through Playwright.
 * Requires a Playwright Chromium (`npx playwright install chromium` locally).
 */
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..');
const skipBuild = process.argv.includes('--no-build');

if (!skipBuild) {
  execSync('npx astro build', { cwd: root, stdio: 'inherit', env: { ...process.env, PUBLIC_FORM_PREVIEW: '' } });
  execSync('npx astro build --outDir dist-preview', {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, PUBLIC_FORM_PREVIEW: 'true' },
  });
  execSync('npx astro build --outDir dist-endpoint', {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, PUBLIC_FORM_PREVIEW: '', PUBLIC_FORM_PROVIDER: 'endpoint', PUBLIC_FORM_ENDPOINT: '/test-endpoint' },
  });
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

function serve(dir, port) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    let p = join(dir, decodeURIComponent(url.pathname));
    try {
      if ((await stat(p)).isDirectory()) p = join(p, 'index.html');
    } catch {
      try {
        await stat(p + '.html');
        p += '.html';
      } catch {
        res.writeHead(404, { 'Content-Type': types['.html'] });
        res.end(await readFile(join(dir, '404.html')));
        return;
      }
    }
    try {
      const body = await readFile(p);
      res.writeHead(200, { 'Content-Type': types[extname(p)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}

let failures = 0;
let passes = 0;
function check(name, cond, extra = '') {
  if (cond) passes++;
  else {
    failures++;
    console.log(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`);
  }
}

const PAGES = ['/', '/services/general-cleaning', '/services/bond-exit-cleaning', '/contact', '/privacy'];
const prod = await serve(join(root, 'dist'), 4401);
const prev = await serve(join(root, 'dist-preview'), 4402);
const PROD = 'http://localhost:4401';
const PREV = 'http://localhost:4402';
const end = await serve(join(root, 'dist-endpoint'), 4403);
const END = 'http://localhost:4403';
const browser = await chromium.launch();

const getPos = (page) =>
  page.$eval('[data-reveal]', (el) => parseFloat(getComputedStyle(el).getPropertyValue('--pos')));

/* ---------------- Pages, headings, overflow, links ---------------- */
console.log('Pages, layout and links');
{
  const seen = new Set();
  for (const width of [320, 390, 768, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const path of PAGES) {
      const res = await page.goto(PROD + path, { waitUntil: 'load' });
      check(`${path} returns 200`, res.status() === 200, String(res.status()));
      check(`${path} has one h1 @${width}`, (await page.locator('h1').count()) === 1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(`${path} no horizontal overflow @${width}`, overflow <= 0, `${overflow}px`);
      const tel = await page.$$eval('a[href^="tel:"]', (as) => as.map((a) => a.getAttribute('href')));
      check(`${path} tel links correct`, tel.length > 0 && tel.every((h) => h === 'tel:+61435895629'));
      for (const href of await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')))) {
        seen.add(href);
      }
    }
    check(`no JS errors @${width}`, errors.length === 0, errors.join('; '));
    await ctx.close();
  }
  const page = await browser.newPage();
  for (const href of seen) {
    const [path, hash] = href.split('#');
    const res = await page.goto(PROD + (path || '/'), { waitUntil: 'domcontentloaded' });
    check(`internal link ${href} resolves`, res.status() === 200, String(res.status()));
    if (hash) check(`anchor #${hash} exists for ${href}`, (await page.locator(`#${hash}`).count()) === 1);
  }
  await page.close();
}

/* ---------------- Production output safety ---------------- */
console.log('Production output');
{
  const page = await browser.newPage();
  await page.goto(PROD + '/');
  const html = await page.content();
  check('production has no callback form', (await page.locator('[data-callback-form]').count()) === 0);
  check('production shows text fallback', (await page.locator('#callback a[href^="sms:"]').count()) === 1);
  check('no preview wording in production', !/preview only/i.test(html));
  check('no TODO/placeholder text in production', !/TODO|lorem|placeholder/i.test(await page.locator('body').innerText()));
  check('no aggregateRating schema', !html.includes('aggregateRating'));
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  check('LocalBusiness schema without street address', ld['@type'] === 'LocalBusiness' && !ld.address.streetAddress);
  check('reviews section hidden without verified reviews', (await page.locator('#reviews-heading').count()) === 0);
  check('no canonical without SITE_URL', (await page.locator('link[rel=canonical]').count()) === 0);
  check('demo build (no SITE_URL) is noindex', (await page.locator('meta[name=robots][content=noindex]').count()) === 1);
  check('care services line published', (await page.locator('.services__more h3', { hasText: 'My Aged Care' }).count()) === 1);
  await page.close();
}

/* ---------------- Reveal: intro sweep ---------------- */
console.log('Reveal');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(PROD + '/');
  await page.waitForTimeout(1600);
  check('intro settles at 70%', Math.abs((await getPos(page)) - 70) < 0.5, String(await getPos(page)));
  check('intro marks session', (await page.evaluate(() => sessionStorage.getItem('hib-reveal-seen'))) === '1');
  await page.reload();
  check('intro does not replay in same session', Math.abs((await getPos(page)) - 70) < 0.5);

  // Keyboard via native range input
  await page.focus('[data-reveal-range]');
  await page.keyboard.press('ArrowRight');
  check('ArrowRight increases reveal', Math.abs((await getPos(page)) - 71) < 0.5, String(await getPos(page)));
  await page.keyboard.press('Home');
  check('Home shows full before', (await getPos(page)) === 0);
  const vt = await page.getAttribute('[data-reveal-range]', 'aria-valuetext');
  check('aria-valuetext describes value', vt === '0% of the after image revealed', vt);
  await page.keyboard.press('End');
  check('End shows full after', (await getPos(page)) === 100);

  // Buttons
  await page.click('text=Show before');
  await page.waitForTimeout(450);
  check('Show before button', (await getPos(page)) === 0);
  await page.click('text=Show after');
  await page.waitForTimeout(450);
  check('Show after button', (await getPos(page)) === 100);

  // Mouse drag
  const box = await page.locator('[data-reveal-frame]').boundingBox();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
  await page.waitForTimeout(50);
  check('mouse drag moves divider', Math.abs((await getPos(page)) - 30) < 2, String(await getPos(page)));

  await ctx.close();
}

/* ---------------- Reveal: reduced motion, no JS, missing media ---------------- */
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(PROD + '/');
  check('reduced motion: no intro, rests at 70%', (await getPos(page)) === 70);
  await page.click('text=Show before');
  check('reduced motion: buttons act instantly', (await getPos(page)) === 0);
  await ctx.close();
}
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(PROD + '/');
  check('no JS: comparison rests at 70%', (await getPos(page)) === 70);
  check('no JS: controls hidden', !(await page.locator('.reveal__controls').isVisible()));
  check('no JS: nav links visible', await page.locator('#site-nav a', { hasText: 'Services' }).isVisible());
  check('no JS: hero call visible', await page.locator('.hero a[href^="tel:"]').isVisible());
  await ctx.close();
}
{
  const ctx = await browser.newContext();
  await ctx.route(/shower-glass-.*aligned/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(PROD + '/');
  await page.waitForTimeout(1200);
  check('missing media: settles at 70% without animation', (await getPos(page)) === 70);
  check('missing media: intro not recorded', (await page.evaluate(() => sessionStorage.getItem('hib-reveal-seen'))) === null);
  await ctx.close();
}

/* ---------------- Touch: vertical scroll still works ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto(PROD + '/');
  const ta = await page.$eval('[data-reveal-frame]', (el) => getComputedStyle(el).touchAction);
  check('reveal frame allows vertical panning', ta === 'pan-y', ta);
  await ctx.close();
}

/* ---------------- Mobile menu + action bar ---------------- */
console.log('Navigation and mobile bar');
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(PROD + '/');
  const toggle = page.locator('[data-menu-toggle]');
  check('menu closed initially', !(await page.locator('#site-nav').isVisible()));
  await toggle.click();
  check('menu opens', (await toggle.getAttribute('aria-expanded')) === 'true' && (await page.locator('#site-nav').isVisible()));
  await page.keyboard.press('Escape');
  check('Escape closes menu and returns focus', (await toggle.getAttribute('aria-expanded')) === 'false' && (await toggle.evaluate((el) => el === document.activeElement)));
  check('mobile action bar visible', await page.locator('[data-action-bar]').isVisible());
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  check('action bar hides over contact section', await page.locator('[data-action-bar]').evaluate((el) => el.classList.contains('is-hidden')));
  await ctx.close();
}

/* ---------------- Callback form (preview build) ---------------- */
console.log('Callback form');
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const events = [];
  await page.exposeFunction('__log', (e) => events.push(e));
  await page.addInitScript(() => window.addEventListener('hibiscus:track', (e) => window.__log(e.detail.event)));
  await page.goto(PREV + '/contact');
  check('preview build renders form', (await page.locator('[data-callback-form]').count()) === 1);

  await page.click('[data-submit]');
  check('empty submit shows name error', await page.locator('#cb-name-error').isVisible());
  check('first invalid field focused', await page.locator('#cb-name').evaluate((el) => el === document.activeElement));
  check('invalid field flagged', (await page.getAttribute('#cb-phone', 'aria-invalid')) === 'true');
  check('action bar hidden while typing', await page.locator('[data-action-bar]').evaluate((el) => el.classList.contains('is-hidden')));

  await page.fill('#cb-name', 'Sam Taylor');
  await page.fill('#cb-phone', '12');
  await page.click('[data-submit]');
  check('short phone rejected', await page.locator('#cb-phone-error').isVisible());
  await page.fill('#cb-phone', '+61 412 345 678');
  check('phone error clears when valid', !(await page.locator('#cb-phone-error').isVisible()));
  await page.fill('#cb-suburb', 'North Lakes');
  await page.selectOption('#cb-service', { index: 1 });
  await page.fill('#cb-message', 'x'.repeat(400));
  await page.click('[data-submit]');
  check('button disabled while pending', await page.locator('[data-submit]').isDisabled());
  await page.waitForSelector('.callback__status.is-preview');
  const msg = await page.locator('[data-status]').innerText();
  check('preview result is explicit, not a fake success', /not sent/i.test(msg) && !/has been sent/i.test(msg), msg);
  check('form start event fired', events.includes('callback_form_start'));
  check('no success event in preview', !events.includes('callback_submit_success'));
  await ctx.close();
}
{
  // Endpoint mode (built with PUBLIC_FORM_PROVIDER=endpoint): success only after a 2xx.
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const events = [];
  await page.exposeFunction('__log', (e) => events.push(e));
  await page.addInitScript(() => window.addEventListener('hibiscus:track', (e) => window.__log(e.detail.event)));
  let status = 500;
  let posts = 0;
  await page.route('**/test-endpoint', (r) => {
    posts++;
    return new Promise((done) => setTimeout(done, 300)).then(() =>
      r.fulfill({ status, contentType: 'application/json', body: '{}' }),
    );
  });
  await page.goto(END + '/contact');
  const fill = async () => {
    await page.fill('#cb-name', 'Sam');
    await page.fill('#cb-phone', '0412 345 678');
    await page.fill('#cb-suburb', 'Griffin');
    await page.selectOption('#cb-service', { index: 2 });
  };
  await fill();
  await page.click('[data-submit]');
  await page.waitForSelector('.callback__status.is-error');
  check('endpoint error shows error state', /couldn’t be sent/.test(await page.locator('[data-status]').innerText()));
  check('no success event on error', !events.includes('callback_submit_success'));
  status = 200;
  // Two rapid submits while the first request is pending → only one POST.
  await page.$eval('[data-callback-form]', (f) => {
    f.requestSubmit();
    f.requestSubmit();
  });
  await page.waitForSelector('.callback__status.is-success');
  check('endpoint 200 shows success', /has been sent/.test(await page.locator('[data-status]').innerText()));
  check('duplicate submit prevented', posts === 2, `posts=${posts}`);
  check('success event fired', events.includes('callback_submit_success'));
  await ctx.close();
}

await browser.close();
prod.close();
prev.close();
end.close();

console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
