# Design notes

## Audience and priorities

1. Local households wanting regular cleaning or housekeeping (the ongoing relationship).
2. Tenants and owners preparing to move out (urgent; separate, prominent route).
3. Commercial enquiries (quiet third option).

Every page answers, in order: who Hibiscus is, what it cleans, where, and how to get in touch.
Primary action: **Call 0435 895 629**. Secondary: **Request a callback**. No other CTA labels.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| Ivory | `#FBF7F3` | Page background (from the brief) |
| Burgundy | `#781C3B` | Headings, buttons, links, contact band |
| Blush | `#F4E5E9` | Alternate sections, hero photo field, footer |
| Charcoal | `#30282B` | Body text |
| Muted | `#62555A` | Secondary text (6.6:1 on ivory) |
| Gold | `#AB8652` | Hairline rules, star, small dots only; never text |

All text pairings are at least 5.8:1. Form field borders are `#8A767C` (4:1).

## Type

- **Lora 500** for headings, brand name and a few serif statements.
- **Source Sans 3 400/600** for body and interface text.
- Three self-hosted WOFF2 files (Latin subset, about 53 KB total), `font-display: swap`.
- H1 is 36px on phones and 62px on desktop. Body text is 17–18px with 1.6 line height, and measures are capped at roughly 34–38em.

## Layout

- Max width 1200px with fluid gutters (16–40px).
- Hero is split 44/56; the blush field behind the photo bleeds to the right edge.
- The two main services sit side by side at 7:5, so general cleaning leads; commercial cleaning is a single quiet row beneath.
- Sections alternate ivory and blush, then a burgundy contact band and a blush footer.
- Numbered markers appear only on the three-step "How to get started" sequence.

## Logo

- The original artwork is used unaltered, cropped to its gold ring and shown circular.
- In the header it sits at 52px beside readable "Hibiscus / Cleaning Services" text, because the tagline inside the logo is illegible at that size.
- The full logo appears at 168px in the footer.
- No new emblem was drawn, and there is no other floral decoration.

## Motion

- **Signature:** the before/after shower-glass reveal.
  - The after image sits on the left, so dragging right "wipes" the glass clean.
  - It plays one 750ms sweep from 25% to 70% per tab session, only once images are decoded, and only if the reveal is at least half visible within 4s of page load.
  - The sweep is skipped for reduced motion, data saver, missing media or prior interaction.
- **Everything else:** 160ms colour and border transitions on links and buttons, and a 180ms slide for the mobile action bar.
- No entrance animations, parallax or loops.
- With `prefers-reduced-motion`, nothing animates and the reveal buttons act instantly.

## Things deliberately avoided

- Fake stars, invented testimonials or counts.
- Aggregate-rating schema.
- Social or map embeds.
- Stock interiors presented as client work.
- The flyers' room imagery, which is brand artwork rather than job photos.
- All-caps eyebrow labels. The one exception is "CLEANING SERVICES" in the header lockup, which mirrors the logo.
