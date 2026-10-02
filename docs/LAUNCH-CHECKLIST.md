# Launch checklist: owner input still needed

Only items that are genuinely missing or need confirming. Everything else is in place.
Values live in `src/content/site.ts`; each has a `source`, `status` and `publish` flag.

## Before going live

- [x] **Hosting.** Cloudflare Workers config is in `wrangler.jsonc`; deploy steps are in the README. The demo runs on the free `*.workers.dev` address with `noindex`.
- [ ] **Domain.** Set `SITE_URL` (e.g. `https://www.hibiscuscleaning.com.au`) in the host's build settings. This turns on canonical URLs, `og:url`/`og:image`, the sitemap and the robots sitemap line.
- [ ] **Form delivery.** Deliberately off for the demo (owner request, 2 Oct 2026). When wanted, choose where callback requests go and set the env vars (see README → *Connecting the callback form*). Until then the site shows "Text 0435 895 629" and "Call instead" in place of the form.
- [ ] **Texting.** Confirm the team is happy to receive callback requests by SMS on 0435 895 629 (used by the fallback while the form is unconnected).
- [ ] **Privacy page.** Review `/privacy` once the form provider and host are chosen. It currently describes no tracking, self-hosted fonts and use of details only to respond.

## Reviews and ratings

- [ ] **Google profile link.** Replace the Google search link in `ratings` with the direct Business Profile or reviews URL.
- [ ] **Counts.** The ratings row shows "5.0 on Google · 2 reviews" and "100% recommend on Facebook · 15 reviews" (from the Google panel on 2 Oct 2026). Update the counts as they grow, or set `countLabel` to `undefined` to hide them.
- [ ] **Review text.** Add two or three verified reviews to `reviews` (exact text, attribution as shown on the platform, link, `permission: true`). The Reviews section stays hidden until then.

## Claims to confirm

Confirmed by the owner on 2 Oct 2026 and published as written on the flyer:

- [x] "Fully insured"
- [x] "Pet-friendly products"
- [x] "Eco-friendly products"
- [ ] ABN: currently hidden (`publish: false`). Add the number if you want it shown in the footer.

## Services

- [x] **Commercial cleaning.** Shown as a short "call to discuss" line, using the flyer's wording (owner confirmed). Supply the scope (offices, strata, etc.) for a fuller description or its own page.
- [x] **DVA, My Aged Care and insurance work.** Published as a short "call to discuss" line, following the flyer (owner confirmed). The site deliberately doesn't claim registered or approved provider status, or mention funding or billing. Add those details only with evidence.
- [ ] **Carpet cleaning.** Shown as "by arrangement". Confirm how it's provided and charged if you want more detail.
- [x] **Location wording.** The site refers to the Moreton Bay region generally (owner request, 2 Oct 2026). Kallangur isn't shown as a base; the suburb list in "Where we clean" is unchanged.
- [ ] **Hours.** Taken from the Google profile (Mon–Fri 6am–6pm, Sat 7am–4pm, Sun closed).

## Photos

- [x] **Shower-glass photos.** Replaced with the sharper side-by-side pair supplied on 2 Oct 2026 (about 510 × 1041 px each). The original full-resolution phone photos would sharpen the hero further.
- [ ] **More work photos.** Authentic photos of finished homes, kitchens and bathrooms (with client permission) would let the service blocks carry images. A same-angle before/after pair works best for the reveal.
- [ ] **Team photo** (optional) for the "little things" section.
- [ ] **Logo files.** A transparent PNG or SVG version of the logo would sit more cleanly in the header than the square artwork.
