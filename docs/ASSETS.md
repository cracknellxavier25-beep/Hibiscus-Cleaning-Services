# Asset and source inventory

| File | What it is | Source | Used on the site |
| --- | --- | --- | --- |
| `docs/source-assets/logo-supplied.webp` | Square logo, 1080 × 1080 | Supplied by owner | Cropped to `src/assets/brand/logo.png` (header, footer, favicon, share image) |
| `docs/source-assets/flyer-general-cleaning.webp` | General cleaning flyer | Supplied by owner | Content only: inclusions, frequency, claims. Not shown. |
| `docs/source-assets/flyer-bond-exit-cleaning.webp` | Bond & exit flyer | Supplied by owner | Content only: inclusions, phone, service types. Not shown. |
| `docs/source-assets/instagram-shower-glass-post-screenshot.webp` | Screenshot of the Instagram post "Shower Glass Restored", 8 Dec 2025, tagged North Brisbane | Supplied by owner (`instagram.com/p/DSAEI0KieCf/`) | Source of the before/after photos |
| `docs/source-assets/shower-glass-pair-supplied.webp` | Side-by-side before/after of the same job, 1041 × 1041 | Supplied by owner, 2 Oct 2026 | Replaces the screenshot crops |
| `src/assets/work/shower-glass-{before,after}-full.png` | The two panels split from the supplied pair (504 × 1041 each; before trimmed 6px a side to match) | As above | "Our work" (home), bond page |
| `src/assets/work/shower-glass-{before,after}-aligned.png` | Same photos cropped to 4:5, offset so the toilet seat and tile lines line up, and upscaled 2× (Lanczos, light sharpening) | As above | Hero reveal |
| `public/og-image.jpg` | Logo centred on ivory, 1200 × 630 | Built from the logo | Social sharing (only emitted once `SITE_URL` is set) |
| `public/fonts/*.woff2` | Lora 500; Source Sans 3 400 and 600 (Latin) | Fontsource, SIL Open Font License | All pages |

**Not used:**

- The flyers' room photography looks like brand artwork rather than photos of Hibiscus jobs, so it isn't presented as work.
- No stock photography was added: the stock libraries were blocked by this environment's network policy.

**Research limitation:** the live Facebook and Instagram profiles were not browsed. All facts come from the brief, the supplied artwork and screenshots, and the owner's answers on 2 Oct 2026.
