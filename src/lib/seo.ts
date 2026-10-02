import { business, serviceArea, isPublished } from '../content/site';

/** LocalBusiness structured data with public, confirmed fields only. No ratings markup. */
export function localBusinessSchema(site: URL | undefined, logoUrl: string) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description:
      'Home cleaning and housekeeping, plus bond and exit cleaning, based in Kallangur, Queensland.',
    telephone: business.phone.tel,
    slogan: business.tagline,
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.base.locality,
      addressRegion: business.base.region,
      postalCode: business.base.postcode,
      addressCountry: business.base.country,
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
    data.areaServed = serviceArea.suburbs.map((name) => ({
      '@type': 'Place',
      name: `${name}, QLD`,
    }));
  }

  return data;
}
