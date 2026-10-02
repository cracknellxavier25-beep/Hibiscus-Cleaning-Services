# Launch checklist: owner input still needed

Only items that are genuinely missing or need confirming. Everything else is in place.
Values live in `src/content/site.ts`; each has a `source`, `status` and `publish` flag.

## Before going live

- [ ] **Domain.** Set `SITE_URL` (e.g. `https://www.hibiscuscleaning.com.au`) in the host's build settings. This turns on canonical URLs, `og:url`/`og:image`, the sitemap and the robots sitemap line.
- [ ] **Form delivery.** Choose where callback requests go, then set the env vars (see README → *Connecting the callback form*). Until then the site shows "Text 0435 895 629" and "Call instead" in place of the form.
- [ ] **Texting.** Confirm the team is happy to receive callback requests by SMS on 0435 895 629 (used by the fallback while the form is unconnected).
- [ ] **Privacy page.** Review `/privacy` once the form provider and host are chosen. It currently describes no tracking, self-hosted fonts and use of details only to respond.

## Reviews and ratings

- [ ] **Google profile link.** Replace the Google search link in `ratings` with the direct Business Profile or reviews URL.
- [ ] **Counts.** The ratings row shows "5.0 on Google · 2 reviews" and "100% recommend on Facebook · 15 reviews" (from the Google panel on 2 Oct 2026). Update the counts as they grow, or set `countLabel` to `undefined` to hide them.
- [ ] **Review text.** Add two or three verified reviews to `reviews` (exact text, attribution as shown on the platform, link, `permission: true`). The Reviews section stays hidden until then.

## Claims to confirm

These come from the business's own flyer and are published as written. Confirm they're still current:

- [ ] "Fully insured"
- [ ] "Pet-friendly products"
- [ ] "Eco-friendly products"
- [ ] ABN: currently hidden (`publish: false`). Add the number if you want it shown in the footer.

## Services

- [ ] **Commercial cleaning.** Shown as a short "call to discuss" line. Supply the scope (offices, strata, etc.) if you want a fuller description or its own page.
- [ ] **DVA, My Aged Care and insurance work.** Hidden until the exact arrangements are confirmed (e.g. registered provider status, how billing works). Set `services.care.publish` to `true` once the wording is approved.
- [ ] **Carpet cleaning.** Shown as "by arrangement". Confirm how it's provided and charged if you want more detail.
- [ ] **Hours.** Taken from the Google profile (Mon–Fri 6am–6pm, Sat 7am–4pm, Sun closed).

## Photos

- [ ] **Original shower-glass photos.** The before/after pair was cropped from an Instagram screenshot (about 456 × 931 px each). Supplying the original phone photos will make the hero noticeably sharper. Replace the files in `src/assets/work/`.
- [ ] **More work photos.** Authentic photos of finished homes, kitchens and bathrooms (with client permission) would let the service blocks carry images. A same-angle before/after pair works best for the reveal.
- [ ] **Team photo** (optional) for the "little things" section.
- [ ] **Logo files.** A transparent PNG or SVG version of the logo would sit more cleanly in the header than the square artwork.
