// @ts-check
import { defineConfig } from 'astro/config';

/**
 * SITE_URL is the final public origin (e.g. https://www.example.com.au).
 * Leave it unset until the real domain exists: canonical URLs and the sitemap
 * are only emitted when it is provided, so no placeholder domain is published.
 * Without it every page also carries <meta name="robots" content="noindex">,
 * which keeps a demo deployment (e.g. *.workers.dev) out of search results.
 */
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // contact.html rather than contact/index.html, so hosts like Cloudflare serve /contact without a redirect.
    format: 'file',
    // The whole stylesheet is small; inlining removes a render-blocking request.
    inlineStylesheets: 'always',
  },
  image: {
    responsiveStyles: false,
  },
  devToolbar: { enabled: false },
});
