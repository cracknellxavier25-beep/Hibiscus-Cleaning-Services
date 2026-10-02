import { business, serviceArea, isPublished } from '../content/site';

/** LocalBusiness structured data with public, confirmed fields only. No ratings markup. */
export function localBusinessSchema(site: URL | undefined, logoUrl: string) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description:
      'Home cleaning and housekeeping, plus bond and exit cleaning, across the Moreton Bay region, Queensland.',
    telephone: business.phone.tel,
    slogan: business.tagline,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'QLD',
      addressCountry: 'AU',
    },
    sameAs: Object.values(business.social)
      .filter((s) => s.publish)
      .map((s) => s.url),
  };

  if (site) {
    data.url = site.href;
    data.image = new URL(logoUrl, site).href;
  }

  if (isPublished(business.hours)) {
    data.openingHoursSpecification = business.hours.rows
      .filter((r) => r.schemaDays.length)
      .map((r) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: r.schemaDays,
        opens: r.opens,
        closes: r.closes,
      }));
  }

  if (isPublished(serviceArea)) {
    data.areaServed = { '@type': 'AdministrativeArea', name: 'Moreton Bay Region, QLD' };
  }

  return data;
}
