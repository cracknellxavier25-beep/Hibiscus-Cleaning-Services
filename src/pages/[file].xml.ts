import type { APIRoute, GetStaticPaths } from 'astro';

/**
 * /sitemap.xml — generated only when SITE_URL is configured, so a placeholder
 * domain is never published. Lists real, indexable pages only.
 */
const paths = ['/', '/services/general-cleaning', '/services/bond-exit-cleaning', '/contact', '/privacy'];

export const getStaticPaths = (() => (process.env.SITE_URL ? [{ params: { file: 'sitemap' } }] : [])) satisfies GetStaticPaths;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL(process.env.SITE_URL!);
  const urls = paths.map((p) => `  <url><loc>${new URL(p, origin).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
