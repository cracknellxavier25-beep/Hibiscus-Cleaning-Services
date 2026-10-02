/**
 * Hibiscus Cleaning Services — single source of truth for site content.
 *
 * Every business fact carries:
 *   - source:  where the fact came from
 *   - status:  'confirmed'  → supplied/confirmed by the owner or commissioning user
 *              'supplied'   → appears in the business's own artwork/socials; confirm wording before launch
 *              'unverified' → not yet established; never rendered
 *   - publish: whether it may appear on the public site
 *
 * Components only render entries where `publish` is true (see `isPublished`).
 * Missing information is tracked in docs/LAUNCH-CHECKLIST.md, never in the UI.
 */

export type Status = 'confirmed' | 'supplied' | 'unverified';

export interface Sourced {
  source: string;
  status: Status;
  publish: boolean;
}

export const isPublished = <T extends Sourced>(item: T | undefined | null): item is T =>
  Boolean(item && item.publish && item.status !== 'unverified');

/* ------------------------------------------------------------------ */
/* Business                                                            */
/* ------------------------------------------------------------------ */

export const business = {
  name: 'Hibiscus Cleaning Services',
  shortName: 'Hibiscus',
  tagline: 'Luxury in every finish',
  phone: {
    display: '0435 895 629',
    tel: '+61435895629',
    href: 'tel:+61435895629',
    sms: 'sms:+61435895629',
    source: 'Bond/exit flyer; Google Business Profile (supplied by owner, 2 Oct 2026)',
    status: 'confirmed',
    publish: true,
  },
  /** Locality only. The street is deliberately not published (service-area business). */
  base: {
    locality: 'Kallangur',
    region: 'QLD',
    postcode: '4503',
    country: 'AU',
    source: 'Google Business Profile (supplied by owner, 2 Oct 2026)',
    status: 'confirmed',
    publish: true,
  },
  hours: {
    note: 'Hours might differ on public holidays.',
    rows: [
      { days: 'Monday to Friday', schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '06:00', closes: '18:00', label: '6am to 6pm' },
      { days: 'Saturday', schemaDays: ['Saturday'], opens: '07:00', closes: '16:00', label: '7am to 4pm' },
      { days: 'Sunday', schemaDays: [], opens: '', closes: '', label: 'Closed' },
    ],
    source: 'Google Business Profile (supplied by owner, 2 Oct 2026)',
    status: 'confirmed',
    publish: true,
  },
  email: {
    value: '',
    source: 'Not supplied',
    status: 'unverified',
    publish: false,
  },
  social: {
    facebook: {
      url: 'https://www.facebook.com/61553597828729/',
      label: 'Facebook',
      source: 'Exact account ID from brief and owner',
      status: 'confirmed',
      publish: true,
    },
    instagram: {
      url: 'https://www.instagram.com/hibiscuscleaningservices/',
      label: 'Instagram',
      source: 'Exact account from brief and owner',
      status: 'confirmed',
      publish: true,
    },
  },
} as const;

/* ------------------------------------------------------------------ */
/* Service area                                                        */
/* ------------------------------------------------------------------ */

export const serviceArea = {
  summary:
    'Based in Kallangur, cleaning homes across Moreton Bay and North Brisbane.',
  /** Ordered roughly north to south for scanning. */
  suburbs: [
    'Dayboro',
    'Burpengary',
    'Deception Bay',
    'Redcliffe',
    'North Lakes',
    'Griffin',
    'Kallangur',
    'Ocean View',
    'Banyo',
    'Nudgee',
  ],
  source: 'Suburb list confirmed by owner, 2 Oct 2026',
  status: 'confirmed',
  publish: true,
} as const;

/* ------------------------------------------------------------------ */
/* Ratings and reviews                                                 */
/* ------------------------------------------------------------------ */

export interface Rating extends Sourced {
  platform: 'Google' | 'Facebook';
  /** Exact on-platform wording; keep the two measures separate. */
  headline: string;
  count?: number;
  countLabel?: string;
  url: string;
}

export const ratings: Rating[] = [
  {
    platform: 'Google',
    headline: '5.0 on Google',
    count: 2,
    countLabel: '2 reviews',
    // TODO(owner): replace with the direct Google Business Profile / reviews link.
    url: 'https://www.google.com/search?q=Hibiscus+Cleaning+Services+Kallangur',
    source: 'Google Business Profile panel, 5.0 from 2 reviews (supplied by owner, 2 Oct 2026)',
    status: 'confirmed',
    publish: true,
  },
  {
    platform: 'Facebook',
    headline: '100% recommend on Facebook',
    count: 15,
    countLabel: '15 reviews',
    url: 'https://www.facebook.com/61553597828729/reviews',
    source: 'Owner states 100% Facebook recommendations; Google "reviews from the web" shows Facebook 5/5 from 15 votes (2 Oct 2026)',
    status: 'confirmed',
    publish: true,
  },
];

export interface Review extends Sourced {
  text: string;
  /** Attribution as shown on the source platform (e.g. first name + initial). */
  author: string;
  platform: 'Google' | 'Facebook';
  rating?: number;
  date?: string;
  url: string;
  permission: boolean;
}

/**
 * Verified review text only. Leave empty until real reviews (with permission)
 * are supplied; the Reviews section hides itself when nothing is publishable.
 */
export const reviews: Review[] = [];

export const publishedReviews = () => reviews.filter((r) => isPublished(r) && r.permission);

/* ------------------------------------------------------------------ */
/* Claims from business artwork                                        */
/* ------------------------------------------------------------------ */

export interface Claim extends Sourced {
  label: string;
}

export const claims: Claim[] = [
  { label: 'Fully insured', source: 'General cleaning flyer', status: 'supplied', publish: true },
  { label: 'Pet-friendly products', source: 'General cleaning flyer', status: 'supplied', publish: true },
  { label: 'Eco-friendly products', source: 'General cleaning flyer', status: 'supplied', publish: true },
  { label: 'Registered ABN', source: 'General cleaning flyer shows "ABN" (number not supplied)', status: 'supplied', publish: false },
];

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export interface Inclusion {
  title: string;
  detail?: string;
  /** true when the flyer marks the item as "upon request" or "by arrangement". */
  onRequest?: boolean;
}

export const services = {
  general: {
    slug: 'general-cleaning',
    href: '/services/general-cleaning',
    name: 'General cleaning',
    navLabel: 'General cleaning',
    summary: 'A fresh, well-kept home, with help for the everyday essentials.',
    description:
      'Regular cleaning and housekeeping that keeps your home fresh, tidy and beautifully maintained, with attention to detail in all the everyday essentials.',
    frequency: ['Weekly', 'Fortnightly', 'Regular'],
    inclusions: [
      { title: 'Bathroom care', detail: 'Showers, toilets, basins and fixtures. Deep cleaning is not part of a general clean.' },
      { title: 'Kitchen detailing', detail: 'Stovetop, microwave, appliances, dishes and a surface refresh.' },
      { title: 'Dusting', detail: 'Surfaces and windowsills.' },
      { title: 'Sanitising touch points', detail: 'Light switches and door handles.' },
      { title: 'Spot wall cleaning', detail: 'Where it’s needed.' },
      { title: 'Vacuuming and mopping' },
      { title: 'Ceiling fans' },
      { title: 'General home reset', detail: 'Tidying and presentation, so the house feels put together.' },
      { title: 'Organisation and light decluttering' },
      { title: 'Room refresh', detail: 'A subtle deodorising finish.' },
      { title: 'Linen changes', onRequest: true },
      { title: 'Washing, folding and ironing', onRequest: true },
    ] as Inclusion[],
    source: 'General cleaning flyer',
    status: 'supplied',
    publish: true,
  },
  bond: {
    slug: 'bond-exit-cleaning',
    href: '/services/bond-exit-cleaning',
    name: 'Bond and exit cleaning',
    navLabel: 'Bond & exit cleaning',
    summary: 'A detailed clean for your next move.',
    description:
      'Detailed, high-quality bond and exit cleaning that leaves the property beautifully presented, so you can focus on the move.',
    inclusions: [
      { title: 'Detailed kitchen cleaning', detail: 'Appliances, cupboards, surfaces and the sink.' },
      { title: 'Deep bathroom and shower clean', detail: 'Tiles, glass, fixtures, toilets, grout and taps.' },
      { title: 'Detailed shower cleaning', detail: 'Removing limescale, soap scum and built-up grime.' },
      { title: 'Floors and skirting boards', detail: 'Vacuuming, mopping, edges and corners.' },
      { title: 'Doors, handles and frames', detail: 'Including switches and light fittings.' },
      { title: 'Windowsills and tracks', detail: 'Inside the property, for a streak-free finish.' },
      { title: 'Built-in cupboards and storage', detail: 'Inside and out.' },
      { title: 'Fans and accessible areas', detail: 'Dusting and detail work.' },
      { title: 'Final presentation and detailing', detail: 'The finishing touches that count.' },
      { title: 'Carpet cleaning', detail: 'Can be arranged with your bond clean. Ask when you enquire; it isn’t automatically included.', onRequest: true },
    ] as Inclusion[],
    source: 'Bond/exit flyer; indexed Facebook post (carpet cleaning can be arranged)',
    status: 'supplied',
    publish: true,
  },
  commercial: {
    slug: 'commercial',
    name: 'Commercial cleaning',
    summary:
      'Hibiscus also takes on commercial cleaning. Call to talk through your space and what it needs.',
    source: 'Bond/exit flyer lists "Commercial"; scope not yet confirmed',
    status: 'supplied',
    publish: true,
  },
  care: {
    slug: 'care',
    name: 'DVA, My Aged Care and insurance cleaning',
    summary:
      'Ask about cleaning arranged through DVA, My Aged Care or insurance.',
    source: 'Bond/exit flyer lists "DVA | My Aged Care | Insurance"; arrangements not confirmed',
    status: 'unverified',
    // Hidden until the owner confirms exact arrangements (see launch checklist).
    publish: false,
  },
} as const;

/** Options for the callback form. */
export const serviceOptions = [
  'General cleaning (weekly or fortnightly)',
  'General cleaning (one-off)',
  'Bond or exit cleaning',
  'Commercial cleaning',
  'Something else',
];

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

export const media = {
  showerGlass: {
    caption: 'Shower glass restored by the Hibiscus team in North Brisbane.',
    alt: {
      before: 'Before: a frameless shower screen clouded with soap scum and water spots, hiding the toilet and tiles behind it.',
      after: 'After: the same shower screen, clear enough to see the white toilet, tiled wall and grey floor behind it.',
    },
    detail:
      'Cloudy, soap-scummed glass brought back to clear, with no haze and no streaks.',
    sourceUrl: 'https://www.instagram.com/p/DSAEI0KieCf/',
    source: 'Hibiscus Instagram post, 8 Dec 2025, supplied by owner as a screenshot. Aligned crop for comparison; no content altered.',
    status: 'confirmed',
    /** 'comparison' = genuine before/after pair. Switch to 'static' to show one image only. */
    mode: 'comparison' as 'comparison' | 'static',
    publish: true,
  },
} as const;

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export const faqs = [
  {
    q: 'Do you offer weekly or fortnightly cleaning?',
    a: 'Yes. General cleaning is available weekly, fortnightly or on another regular schedule. Call or request a callback to talk through what suits your home and current availability.',
  },
  {
    q: 'What’s the difference between general cleaning and bond cleaning?',
    a: 'General cleaning keeps a lived-in home fresh: bathrooms, kitchen, dusting, floors and an overall reset. It doesn’t include deep cleaning. A bond or exit clean is a detailed clean for moving out, including inside cupboards, skirting boards, window tracks and a deep bathroom and shower clean.',
  },
  {
    q: 'Can you change linen or do the laundry?',
    a: 'Linen changes, and washing, folding and ironing, are available on request with general cleaning. Mention them when you enquire so they can be included in the scope you agree on.',
  },
  {
    q: 'Is carpet cleaning included in a bond clean?',
    a: 'Carpet cleaning can be arranged alongside a bond clean, but it isn’t automatically included. Ask about it when you enquire.',
  },
  {
    q: 'How do I get a quote?',
    a: 'Call 0435 895 629 or request a callback with your suburb and the service you need. Every home is different, so the scope, price and timing are worked out with you directly.',
  },
  {
    q: 'Do you clean in my suburb?',
    a: 'Hibiscus is based in Kallangur and cleans across Moreton Bay and North Brisbane, including North Lakes, Griffin, Burpengary, Deception Bay, Redcliffe, Dayboro, Banyo and Nudgee. Not sure whether you’re covered? Call and ask.',
  },
];

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const nav = [
  { label: 'Services', href: '/#services' },
  { label: 'Our work', href: '/#our-work' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/contact' },
];

export const cta = {
  call: `Call ${business.phone.display}`,
  callback: 'Request a callback',
};
