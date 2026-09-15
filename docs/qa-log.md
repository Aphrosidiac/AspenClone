# QA log — FF Search (aspensearch.com rebuild)

All captures are headless Chromium (Playwright, cached headless-shell 1243) at fixed widths, both sites in the same
harness, same scroll positions. Sheets: reference on the LEFT, ours on the RIGHT, red bar between.
The in-app Browser pane and the Chrome-MCP tab were both `visibilityState: hidden` for most of the session — rAF
and timers stalled there, so motion was measured headlessly instead (the tab there does render).

## 2026-09-15 — research
- Snapshot: `docs/reference/2026-09-15/` — raw SSR HTML (home, privacy), robots/llms/sitemap, 60 assets with manifest,
  hydrated DOM dumps at 1440 and 390 (+ contact / team / privacy modals, mobile menu), extractor token JSON, viewport
  captures every 900 px (desktop) / 844 px (mobile), entrance frames, hover states, width sweep.
- Bundle read for behaviour: Dither (perlin fbm + Bayer + fluid dye), ShaderField (trail RGB split + grid
  displacement), Lenis, framer-motion, R3F/postprocessing. Constants copied into `docs/reference-spec.md`.
- Instrument note: Vercel skew protection — chunk URLs 404 without `?dpl=<id>`; the headless GPU only paints
  ~900 px of any canvas per screenshot (the flat #e0e0e0 areas in captures are the instrument, not the site).

## 2026-09-16 — build + passes
### Visual pass 1 (desktop 1440, 13 frames) — `docs/qa/compare_v1`
- Structure/type/colour matched on first render. Defects: h3 "Engineering / & / Infrastructure" 3 lines (probe width
  rounding), stray line breaks around hyphenated words ("venture-\nbacked"), Team photos hidden (shader canvas
  painted below the banner's canvas), testimonial height differed (reference shuffles + auto-advances).
- Fixes: exact fractional probe width + nowrap lines; hyphen-aware grouping; ShaderCanvasHost moved into the slider's
  stacking context (z -1 there, like the reference); testimonial deck shuffled with a 6.7 s timer + bar.
### Visual pass 2 — `docs/qa/compare_v2`, dither crop `docs/qa/dither_crop.png`
- scrollHeight now identical (10847). Dither tone was too dark: `new THREE.Color(hex)` converts sRGB→linear while the
  reference feeds raw components; fixed → white/black ratio 60/35 vs 51/31 (rest is their logo shape).
- Illustration 4 orbit reworked from the reference's DOM samples.
### Visual pass 3 — `docs/qa/compare_v3`, 1:1 crops `docs/qa/crops_v3.png`
- Text positions match to the pixel in the crops (header, hero, cards, insights, about copy).
- Range-based line splitter (one text node per paragraph → Range rects) replaced span-per-word measuring, which lost
  cross-word kerning and wrapped "Page Not Found" / "A cookie-free site". Splitting now waits for the real font
  faces (`document.fonts.load`) — a fallback-metric split shrinks a w-fit box and can never recover.
- Mark viewBox tightened to content bounds so the header tile matches the reference's optical size.
### States — `docs/qa/compare_states_v2`, `_v3_*`
- Contact / team / privacy modals, dark theme, dark clients hover, dark footer hover, mobile menu, mobile contact,
  mobile team modal: all match. Mobile menu initially painted under `main` (same z-index, earlier in DOM) → portalled.
### Hover — `docs/qa/compare_hover_v2`
- Contact, hero CTA, client row, team card (mint→dark + tag inversion + RGB trail), footer CTA wipe, footer email: match.
- Team parallax: reference offsets decay slowly with scroll (k≈0.235 then 0.064 at two captures) → k = (top/vh)^1.7.
### Widths — `docs/qa/compare_widths_v4`
- 320 / 768 / 1024 / 1920 captured on both. Ours had 15–28 px horizontal overflow: em-dash word ("positions—we")
  assigned to the wrong line (splitter now splits at any browser break), odometer cells sized by "0" instead of the
  final digit (reference SSR sizes by the final digit), illustration 4 spilling past the viewport (`overflow-x-clip`
  on the insights section). All widths now overflowX 0.
### Functional — `tools/functional.mjs` (36 checks)
- Dev and production build: 36/36. Covers modals (open/close/Escape/backdrop/deep link/focus), copy button, CV upload
  validation (pdf ok, exe rejected, >5 MB rejected), /privacy-policy, 404, anchor scroll offset, client hover
  counter, testimonial prev/next, team slider next/prev + modal, theme persistence, alt attrs, landmarks,
  keyboard-focus mode, mobile menu links + Contact, no console errors.
### Reduced motion
- `prefers-reduced-motion: reduce`: no overlay, 0/153 lines hidden, dither renders one frame, marquee static (CSS).

## Known gaps (see docs/parity.md)
- Illustration motion parameters and the confetti burst are inferred, not frame-matched.
- Privacy copy renders the email as plain text (reference: link).
- OG image not generated; no CV upload backend (local test).

### Visual pass 5 — `docs/qa/compare_v5`
- Diff scores (>40 grey-level px %): 5.5, 1.9, 2.7, 0.1, 0.4, 1.2, 4.5, 1.4, 10.3, 6.6, 10.7, 3.7, 3.6 — the higher
  frames are the animated dither fields / a mid-transition testimonial, not layout.
- Team parallax re-measured at three scroll positions on the reference: translateY = offset × f with
  f = clamp((sliderTop − 0.05vh) / 0.95vh, −1, 1). Ours now reproduces the reference's transforms to ±0.03%.
- Testimonial transition sampled: old lines exit upward (−100%, opacity 0) under the mask, meta blocks fade with an
  8 px translate — implemented via AnimatePresence exit on the line spans (`keepMask`).
- Live pane checks: mint fluid trail on the dither, RGB-split/grid displacement on team photos, theme sweep.

### Entrance re-measured frame by frame — `docs/reference/2026-09-15/entrance_rec.json`
- Recorded the reference's overlay/wrapper styles every animation frame (page-side rAF, WebGL chunks delayed so the
  main thread stays free). Result: phase 1 = 0.8 s ease-in-out(.87,0,.13,1), outer opacity 0→1 + scale .4→1;
  phase 2 = 1.2 s, same ease, inner scale .3→1 **and** clip-path wipe together; the mark inside is the full-size
  background logo (min(72vw,44rem), text-grey), so it lands exactly where the coin lives.
- Our first implementation never scaled (imperative `animate()` on a motion element left `transform: none`);
  rebuilt with motion values — the recorded trace now matches (43→108 px in 0.8 s, 108→360 px over the wipe).
- Coin spin now starts after the entrance, as measured on the reference (0° during the overlay).
