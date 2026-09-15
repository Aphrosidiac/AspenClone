# FF Search

FF Dev Studio's executive-search site — a 1:1 rebuild of [aspensearch.com](https://www.aspensearch.com/)
under our own `//FF` mark. Vite 8 + React 19 + Tailwind v4 (the reference's own token vocabulary) + motion +
Lenis + three (raw; own fluid sim and shader planes).

```bash
npm install
npm run dev        # http://localhost:3158
npm run build && npm run preview   # http://localhost:3159
```

## What's in it

Entrance (measured frame by frame), sticky header with the NYC/LA odometer clock and coin-spinning mark, theme
toggle with a view-transition sweep, hero with the WebGL dither field + mint cursor trail, stats odometers,
insights with four procedural line illustrations, clients, shuffled auto-advancing testimonials, team slider with
the cursor RGB-split shader over the photos, banner, footer, drawer modals (contact with CV dropzone, eight team
members, privacy), 404, mobile layout and menu, dark theme, reduced-motion resting state.

## Docs

- `docs/brief.md` — scope, identity, what is deliberately not built
- `docs/reference-spec.md` — the measured spec (tokens, anatomy, motion numbers, provenance)
- `docs/qa-log.md` — every visual/functional pass and the instrument traps hit
- `docs/parity.md` — the countable ledger: done / partial / deferred / omitted
- `docs/reference/2026-09-15/` — snapshot of the reference: raw HTML, hydrated DOM dumps, assets + manifest,
  token JSON, per-frame entrance recording, captures at every width

## Tools (headless Chromium via Playwright)

- `tools/ref_scroll_shots.mjs <url> <w> <h> <outdir> <step>` — viewport captures while scrolling
- `tools/shots_states.mjs <url> <outdir>` / `shots_hover.mjs` / `shots_widths.mjs` — modals, hover, widths
- `tools/ref_probe.mjs <script.js> [w] [h]` — run a probe script against `URL` (measurements, recordings)
- `tools/functional.mjs [url]` — 36 behaviour checks (modals, upload validation, routes, sliders, theme, a11y)
- `tools/og.mjs`, `tools/team_imgs.mjs` — brand image and photo derivatives

Fonts, photos, client logos and copy are the reference's, reused for this local test only — swap before launch
(see `docs/brief.md`, Provenance in the spec).
