# Hibiscus Cleaning Services website

A static Astro site for Hibiscus Cleaning Services (Kallangur, QLD). It has five pages: home, general cleaning, bond & exit cleaning, contact and privacy.

## Run it

```bash
npm install
npm run dev            # http://localhost:4321 (callback form in preview-only mode)
npm run build          # type-check + production build → dist/
npm run preview        # serve dist/
npm run test:e2e       # builds 3 variants and runs browser checks (needs Playwright Chromium)
```

Node 20+ is required. For the browser tests on a fresh machine, run `npx playwright install chromium` once.

The output is plain static files in `dist/`, so it can be hosted anywhere. It's set up for Cloudflare (below).

## Deploy to Cloudflare (free `*.workers.dev` address)

`wrangler.jsonc` deploys `dist/` as a Cloudflare Workers static site. `public/_headers` sets caching and security headers. The easiest route is to let Cloudflare build straight from GitHub:

1. Sign in or sign up (free) at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages → Create → Import a repository**. Connect GitHub and pick `Hibiscus-Cleaning-Services`.
3. Enter these settings:
   - **Project name:** `hibiscus-cleaning-services`
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Production branch:** the branch holding this code (currently `claude/awesome-ptolemy-8or41u`)
   - **Environment variables:** none needed for the demo
4. Click **Deploy**. The site goes live at `https://hibiscus-cleaning-services.<your-account>.workers.dev`. Every push to the branch redeploys it.

From your own computer you can deploy instead with `npx wrangler login`, then `npm run deploy`.

**Troubleshooting: live site not updating.** Cloudflare builds only on pushes made after the repo was connected. Retrying a deployment rebuilds that same commit. Push a new commit to the branch, then check **Deployments → Recent builds** for the new commit hash.

**While no domain is set** (no `SITE_URL`), every page carries `noindex`, so the demo stays out of Google. The callback form stays off and visitors are offered text or call instead.

**When you're ready to launch:**

1. Add a custom domain in Cloudflare (**Settings → Domains & Routes**).
2. Set `SITE_URL` as a build variable. This turns on indexing, canonical URLs and the sitemap.
3. Connect the form (below) if you want it.

## Updating content

All business facts live in **`src/content/site.ts`**: phone, hours, suburbs, ratings, reviews, claims, service inclusions, FAQs and the photo captions.

- Each entry records its `source`, a `status` and a `publish` flag. Only published entries are rendered.
- **Reviews:** add objects to `reviews` with `publish: true` and `permission: true`. The Reviews section appears automatically, showing up to three.
- **Photos:** replace the files in `src/assets/work/`, keeping the same names. Images are resized and converted to WebP at build time.
  - The hero reveal expects an aligned before/after pair, ideally 4:5 at 800px wide or larger.
  - Set `media.showerGlass.mode` to `'static'` to show a single image instead.
- **Logo:** `src/assets/brand/logo.png`.

The list of missing information is in [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md).

## Environment variables

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Final domain. Enables canonical URLs, social image URLs and `/sitemap.xml`. Leave empty until the domain exists. |
| `PUBLIC_FORM_PROVIDER` | `endpoint` or `netlify`. Empty means no form: the contact block shows text/call options instead. |
| `PUBLIC_FORM_ENDPOINT` | POST URL for the `endpoint` provider. |
| `PUBLIC_FORM_ACCESS_KEY` | Public key some providers need (e.g. Web3Forms). It's sent with the form, so never use a secret here. |
| `PUBLIC_FORM_PREVIEW` | `true` shows the form but never sends it. Submitting says "Preview only: this request was not sent." For local testing only. |

## Connecting the callback form

Pick one option:

- **Formspree:** create a form, then set `PUBLIC_FORM_PROVIDER=endpoint` and `PUBLIC_FORM_ENDPOINT=https://formspree.io/f/<id>`.
- **Web3Forms:** set `PUBLIC_FORM_PROVIDER=endpoint`, `PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit` and `PUBLIC_FORM_ACCESS_KEY=<key>`.
- **Netlify Forms:** deploy on Netlify and set `PUBLIC_FORM_PROVIDER=netlify`. The form is detected at build time; set up email notifications in the Netlify dashboard.

How the form behaves once connected:

- **Validation:** the browser checks name, phone (8–15 digits), suburb and service before sending.
- **Server side:** the provider handles server-side validation, spam filtering and delivery. A hidden honeypot field (`company`) is included. Turn on the provider's spam protection, and reCAPTCHA or Turnstile if spam becomes a problem.
- **Result:** success is shown only after the provider returns a 2xx response, and the submit button is disabled while a request is pending. On failure the visitor sees an error with the phone number.
- **Testing:** send to a test recipient first.

## Analytics hooks

Nothing is tracked by default. The site dispatches `hibiscus:track` events on `window` (and pushes to `window.dataLayer` if a tag manager defines it):

- `call_link_click` (with `location`)
- `callback_form_start`
- `callback_submit_success`
- `reveal_interaction`

Form contents are never included. A phone-link click is not a completed call.

## Project structure

```
src/
  content/site.ts        all business content + verification flags
  lib/form-config.ts     form delivery mode (build-time)
  lib/seo.ts             LocalBusiness structured data (no ratings markup)
  components/            Header, Footer, Reveal, CallbackForm, ContactSection, …
  layouts/BaseLayout.astro
  pages/                 index, services/*, contact, privacy, 404, robots.txt, [file].xml (sitemap)
  styles/global.css      tokens, type scale, buttons
public/fonts/            self-hosted WOFF2 (OFL)
docs/                    design notes, asset inventory, launch checklist, source artwork
tests/e2e.mjs            Playwright checks
```
