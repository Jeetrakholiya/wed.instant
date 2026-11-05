# Mobile wedding invitation website plan

## Reference and goal

Reference: https://www.scrollvite.com/preview/5 (ScrollVite's “Zari” preview).

Build a mobile-first, vertically scrolling wedding invitation with the same overall journey and level of polish. The visual direction is Indian wedding stationery: textured fabric and paper, burgundy and gold, ornate borders, script lettering, warm photography, and small ceremonial details. Use original or properly licensed assets for the finished site.

The reference is a **guest-facing invitation**, with a vendor preview bar overlaid on it. The guest-facing build should omit the vendor price, “Try it,” and “Create Your Invite” bar.

## Observed visitor journey

1. **Sealed cover:** Full-screen embroidered envelope with a wax seal and “Tap to open.” Tapping plays the opening animation. Offer a skip control.
2. **Hero:** Full-screen couple portrait, wedding title, names, date, and a subtle scroll cue.
3. **Photo collage:** Three torn-edge photos on a burgundy fabric background. Names and date remain the focus.
4. **Invitation reveal:** A formal invitation card rises out of an ornate envelope as the visitor scrolls. The card shows the couple, date, time, venue, and a map link.
5. **Details:** When, where, and attire on a separate paper panel.
6. **Celebrations:** Four individually styled event cards (Mehendi, Sangeet, Wedding, Reception), each with date, time, venue, and map link.
7. **Countdown:** Deep blue patterned section with days, hours, minutes, and seconds until the wedding.
8. **Personal note:** Torn paper, photos, floral accents, and a message from the couple.
9. **Blessings and close:** Family names, decorative floral seal, final couple signature, and a way to return to the sealed cover.

The reference also has a floating music toggle. Background audio should remain off until the guest taps to play, and the choice should be clearly visible.

## Implementation

### Foundation

- Start with a small Vite + TypeScript project and static hosting. This invitation does not need a backend for the observed features.
- Keep all wedding details in one typed data file: names, date and timezone, venue, attire, event schedule, map URLs, note, blessings, and image paths. Components read from that data so future invitations are easy to personalize.
- Build each section as a semantic component. Preserve a single page and natural vertical scrolling; avoid forced scroll snapping.

### Motion

- Make the cover a fixed full-screen layer. On tap, animate envelope flaps, seal, and cover exit, then reveal the hero. Provide Skip and respect `prefers-reduced-motion`.
- Use scroll-linked progress for the collage and card emerging from the envelope. Use CSS transforms and opacity for most effects; reserve scroll-driven JavaScript for the layered card sequence where precise progress matters.
- Reveal event cards and paper sections with restrained entrance animations. Keep every text block readable if animation or JavaScript fails.
- Calculate the countdown from the configured event time in the correct timezone. Replace the timer with a celebration message after the date passes.
- Pause or avoid expensive animation when the page is hidden. Preload only the cover and hero assets; lazy-load the rest.

### Visual system and assets

- Build reusable styles for fabric textures, paper grain, gold borders, wax seal, floral corners, torn photo edges, and arch-shaped event cards.
- Source or create: 3–4 couple photos, envelope/fabric texture, gold motif and border art, decorative event objects, floral seal artwork, and optional background music. Export responsive WebP/AVIF images with appropriate sizes.
- Use a high-contrast serif for formal details and a script face for names/headings. Check script legibility on a 360 px screen.
- Use the reference's palette as a starting point: cream, antique gold, burgundy, rose, and deep indigo. Match spacing, layers, and motion before fine decorative details.

## Build order

1. **Content and assets:** Replace demo details with real wedding details; gather photos and artwork. Create a clear asset manifest.
2. **Static mobile page:** Implement all sections and links at 360–430 px widths, with a comfortable desktop presentation.
3. **Opening and scroll motion:** Add the envelope sequence, collage movement, card reveal, and section entrances.
4. **Functional features:** Countdown, map links, audio control, skip/reopen, and optional calendar link. RSVP is a separate feature because it is not present in this reference.
5. **Polish and QA:** Tune layout against mobile screenshots, test touch scrolling, image loading, keyboard access, reduced motion, audio behavior, and desktop widths.

## Acceptance checks

- The cover opens by tap or keyboard and can be skipped or reopened.
- The page scrolls smoothly on common phones without horizontal overflow or text hidden beneath controls.
- All event information is readable and map links open the intended location.
- The countdown uses the configured timezone and handles the event passing.
- Music never starts unexpectedly and can be muted at any time.
- The page remains usable with reduced motion and without audio.
- Assets are original/licensed and optimized for mobile data connections.

## Inputs needed before final personalization

- Couple names, date/time/timezone, venue address, and event schedule.
- Couple photographs and permission to use them; preferred decorative style or supplied artwork.
- Personal note, family/blessings names, attire wording, and music track (if desired).
- Hosting choice and whether this is one invitation or a reusable template editor for many couples. The plan above is for one invitation with configurable content.
