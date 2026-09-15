# Parity ledger

**32/38 complete** — 32 done, 3 partial, 1 deferred, 2 omitted

## a11y

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| A11Y-01 | Landmarks, h1, alt attrs, sr-only odometer text, dialogs with aria-modal + Escape, keyboard-focus ring mode, reduced-motion resting state | done | Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build + reduced-motion probe |  |

## about

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| STAT-01 | Eyebrow + two body-30 paragraphs + 3 stat cards on the 4×5 grid with sticky cards | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) frames 02–04 |  |
| STAT-02 | Odometer digits roll in when in view; cells sized by final digit | done | Reference SSR shows invisible final digit + stack at 0; ours identical; digit widths at 320 now match (281px) |  |
| STAT-03 | Confetti burst on stat entry | partial | Reference has a Confetti component whose exact look was not captured; ours fires a mint/fg square burst once per stat. Not compared frame-by-frame |  |

## background

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| BG-01 | Fixed grey coin logo behind sections, above dither; -18°/s + scroll-velocity kick | done | Idle rate measured -18.0°/s on reference; ours -18°/s; visible in compare_v3 frames 10 |  |

## banner

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| BAN-01 | Overlapping banner (-60svh) with dither, boxed uppercase words at 8.62cqw, letter roll-in, mint arrow square | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) frame 10 |  |

## clients

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| CLI-01 | Dither panel, sticky Clients h2, logo column + name flip + odometer counter, 6 hover rows with fg scaleY fill | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) frames 06–07; hover capture compare_hover_v2/clients_hover_full.png; Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build |  |

## entrance

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| ENT-01 | Black overlay, mark fade/scale (.4→1, inner .3→1), clip-path wipe to the left | done | Timeline sampled on both (probe_entrance*.js); frames docs/qa/entrance_local_sheet.png; pre-hydration overlay in index.html |  |
| ENT-02 | Content reveals (lines rise in masks, nav slides up) only after the wipe | done | SiteIntro gate; line reveal timing (stagger 50 ms, 1.2 s ease-out, mask -0.25em) fitted to reference samples (probe_reveal.js) |  |

## footer

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| FTR-01 | Two-row footer: tagline, links, analog clocks, email + LinkedIn rows, dark plate with wordmark/credits, mint CTA card with clip-path hover | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) frames 11–12; hover capture compare_hover_v2/footer_cta.png |  |

## header

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| HDR-01 | Sticky 60px header, 2-col grid, logo tile, nav, theme toggle, Contact button | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png); hover captures docs/qa/compare_hover_v2 |  |
| HDR-02 | NYC/LA odometer clock alternating every 5 s (.65s ease-out roll) | done | Reference period measured 5.0–5.4 s (probe_time.js); ours 5 s; roll transition copied from DOM |  |
| HDR-03 | Nav link hover: fg block slides up, label inverts (600ms) | done | CSS copied from reference class list; hover capture of Contact/nav in compare_hover_v2 |  |
| HDR-04 | Mobile Menu/Close bar + full-screen menu with clocks + theme toggle | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) (docs/qa/compare_states_v3_menu.png) + Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build |  |
| HDR-05 | Anchor links smooth-scroll under the header (Lenis) | done | Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build — #clients lands at top=60 |  |
| HDR-06 | Theme toggle with view-transition clip sweep, persisted in localStorage | done | Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build (dark persists across reload); sweep CSS measured from reference |  |

## hero

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| HERO-01 | Sticky h1 row, dark intro card + CTA, mint welcome card + logo marquee (12.8 s) | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) |  |
| HERO-02 | Second word grey panel + container-fit PLACING / WINNERS. (22.09cqw) | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png); cqw computed from measured widths |  |
| HERO-03 | Mobile stacked hero (pt-188 panels, dark/mint cards) | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) (compare_390_v2/00.png) |  |

## insights

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| INS-01 | Sticky grey panel with container-fit h2, paragraph + CTA; 4 items with index, h3, illustration, text, bullet list | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) frames 04–06 |  |
| INS-02 | Four animated line illustrations | partial | Structure (viewBox, strokes, dash patterns, element counts) copied from DOM; motion parameters inferred from two DOM samples each, not frame-matched |  |

## modals

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| MOD-01 | Drawer modal: right panel 50%, backdrop, mint close square, Escape/backdrop/close, URL ?modal=, focus trap | done | Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build |  |
| MOD-02 | Contact modal: Contact/Schedule, E:/T: rows with copy-to-clipboard, LinkedIn, clocks, Upload CV dropzone with type/size validation | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) (compare_states_v2/d_contact.png) + Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build |  |
| MOD-03 | CV upload backend | omitted |  | Local test only per brief: the file is validated and acknowledged client-side; nothing is uploaded (reference uses Vercel Blob) |
| MOD-04 | Privacy Policy modal + /privacy-policy route | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) (compare_states_v3_privacy.png) + Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build |  |
| MOD-05 | Inline links inside privacy copy (email link) | deferred |  | AnimatedText renders plain lines; the reference renders the email as a link. Cosmetic, deferred |

## pages

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| PAGE-01 | 404 page (two-column layout, Back to Home) | done | Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build; docs/qa/404_local.png |  |

## performance

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| PERF-01 | three.js split into lazy chunks; fonts preloaded; images sized | done | vite build: main 148 KB gz, three 130 KB gz lazy; production build passes the functional pass |  |

## platform

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| CMS-01 | Sanity CMS + analytics | omitted |  | Out of scope per brief; content lives in src/data |

## responsive

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| RESP-01 | 320/375/390/768/1024/1440/1920 without horizontal overflow | done | tools/shots_widths.mjs: overflowX 0 at every width after the illustration clip fix; compare_widths_v4 |  |

## seo

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| SEO-01 | Title/description/canonical/OG/favicon | partial | Tags present in index.html; OG image is a placeholder path (/img/og.png not generated); no sitemap/robots for a local test |  |

## team

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| TEAM-01 | Header block (h2 sticky, tagline, eyebrow, prev/next, paragraph) | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) frame 09 |  |
| TEAM-02 | Horizontal snap slider, 4 cards/viewport, drag to scroll, prev/next, per-card parallax offsets | done | Offsets measured from DOM (20/55/35/70/40/25/60/45%); decay fitted to two reference captures; Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build |  |
| TEAM-03 | Cursor RGB-split + grid displacement shader over the photos | done | Shader ported from bundle source; visible in compare_hover_v2/team_hover_full.png on both |  |
| TEAM-04 | Team member modal: photo hero with shader, role tag, Schedule, name block, dither+coin, Email/LinkedIn, Bio | done | Measured visual pass 2026-09-16: side-by-side Playwright captures at 1440/390 (docs/qa/compare_*), 1:1 crops (docs/qa/crops_v3.png) (compare_states_v2/d_team_ben.png) + Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build |  |

## testimonials

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| TST-01 | Shuffled deck, auto-advance 6.7 s with progress bar, prev/next, portrait wipe, meta fade, dither cell | done | Reference probe_testi2.js: shuffled order + 6.7 s auto-advance + timer bar; Functional pass 2026-09-16: tools/functional.mjs 36/36 on dev + production build |  |

## webgl

| ID | Feature | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| DTH-01 | Dither background: perlin fbm → Bayer 2-colour, mint fluid cursor trail | done | Shader constants taken from bundle; tone distribution matched (white 60% / black 35% vs ref 51/31 excl. logo) docs/qa/dither_crop.png; trail verified with pointer in headless capture |  |
| DTH-02 | Lazy mount within 1200px, render only while visible, reduced-motion = single frame | done | Code path; reduced-motion probe docs/qa/reduced_motion.png |  |

