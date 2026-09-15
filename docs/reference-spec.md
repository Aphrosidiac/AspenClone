# Reference spec — aspensearch.com → FF Search

Markers: `[measured]` extracted from DOM/CSS/bundle · `[observed]` seen in a real render · `[inferred]` reasoned.

## 1. Snapshot
- https://www.aspensearch.com/ crawled 2026-09-15 at 1440×900 and 390×844 (Playwright headless + in-app pane).
  No A/B variant seen. Next.js 16 (turbopack), Sanity CMS, Tailwind v4, framer-motion (`motion`), Lenis,
  three r185 + R3F + @react-three/postprocessing, a tiny fluid sim, Umami analytics. `[measured]` from bundle.

## 2. Sitemap `[measured]`
- `/` — the only page. Sections (in order): hero → `#about` stats → insights (4 disciplines) → `#clients` →
  `#testimonials` → `#team` → banner ("Let's start a conversation") → footer.
- Modals (parallel route, `?modal=contact`, team slugs, `privacyPolicy`): right-side drawer, 50% wide on lg.
- `/privacy-policy` — same content as the privacy modal. 404 — "404 / Page Not Found" two-column layout.

## 3. Design tokens `[measured]` (from `3910qv-cxfuqm.css` `@theme`)
```
--spacing: .0625rem  (1 unit = 1px; p-20 = 20px, h-60 = 60px …)
--site-header-height: 60px
colors: black #232323, black-deep #000, white #fff, mint #a1ffcb, grey #d9d9d9
theme: light bg 255 255 255 / fg 35 35 35 ; dark bg 35 35 35 / fg 255 255 255 (rgb triplets, `data-theme`)
fonts: suisseIntl (400 Regular, 450 Book, 600 SemiBold, italics) ; suisseIntlMono 400
fallback: Arial size-adjust 103.05% ascent 95.68% descent 30.18% ; mono Arial size-adjust 141.57%
type (size / weight / lh / tracking):
  caption-10 12px 400 1.1 -4%    caption-20 14px 400 1 -4%
  body-10 16px 450 1.3 -4%       body-20 24px 450 1.1 -2%   body-30 fluid 24→32 450 1.1 -2%
  headline-10 fluid 24→40 450 1.1 -4%   headline-20 32→48 450 1 -4%   headline-30 40→56
  headline-40 40→100 450 1 -4%          headline-50 52→200 450 0.8 -4%
  digit-10 80 / digit-20 80→120 / digit-30 80→140, 450, lh 1, -4%
fluid slope: between 375 and 1600 viewport px (`--layout-min-w/--layout-max-w`)
easing: ease-in cubic-bezier(.55,0,1,.45) ; ease-out cubic-bezier(.16,1,.3,1) ; ease-in-out cubic-bezier(.87,0,.13,1)
borders: 1px currentColor everywhere (divide-x/y, border-t…) ; `shadow-border-b` = box-shadow 0 1px ; `inset-shadow-border-t` = inset 0 1px
scrollbar: custom 6px+1px, track = fg, thumb = bg ; `--sbw` = scrollbar width set on <html>
focus ring: 4px mint, 2px offset ; ::selection fg/bg inverted
keyframes: hero-logo-coin 20s linear infinite rotateY 0→-360 ; theme-sweep-ltr/rtl clip-path 1.2s ease-in-out (view transition)
```

## 4. Page anatomy (desktop lg ≥1024) `[measured]` from hydrated DOM
- **Header** sticky 60px, 2 cols. Left: 60×60 fg logo tile · time (`11:48 AM NYC` odometer, alternates NYC/LA every few s, slot-machine roll .65s ease-out) · Right: nav (About/Clients/Testimonials/Team, hover = bg slides up from bottom 600ms) · theme toggle (two circles) · `Contact` button 200px min, h-60, fg bg, mint fill sweeps from left on hover (800ms ease-out).
  Mobile: nav replaced by mint `Menu/Close` bar with 2-line burger.
- **Hero** `relative`, Dither canvas absolute inset-0 (bg #e0e0e0), z-1 content:
  row 1 (min-h 100svh-60, grid-rows-2): sticky 2-col — left white panel `h1 Aspen` headline-50 bottom-left; right empty (dither shows).
  row 2: 2-col — left empty; right `inset-shadow-border-t grid-cols-2`: dark card (body-20 text + `START A CONVERSATION` button h-36 mono caption-10 uppercase, mint sweep) · mint card (body-20 text, "Recent hires from:", logo marquee h-80 w-100 tiles gap-8, 12.8s linear).
  Then `grid divide-y`: row (min-h calc(50svh-30px)) 2-col: empty · grey panel `Search` headline-50 bottom-left. Row (min-h 65svh) 2-col: dark panel with `PLACING` / `WINNERS.` container-fit uppercase (font-size ≈22.09cqw, lh .82, first mr-auto second ml-auto) · empty.
- **Stats `#about`** border-t bg: 2-col divide-x: eyebrow (8px square + mono caption `ABOUT ASPEN`) · body-30 two paragraphs (pb-348 on lg). Then a 4-col × 5-row(200px) grid: `500+` black card (col 3 row 1, sticky, digit-10) · `$1M-5M` mint (cols 1-2 rows 2-5, digit-30, label ml-auto) · `19+` grey (col 4 rows 2-3, sticky, digit-20). Digits are odometers; a confetti burst plays when they enter.
- **Insights** 2-col divide-x: left sticky grey panel min-h 100svh-60: h2 `CONNECTING / TOP-TIER / TALENT` container-fit (15.85cqw) alternating alignment; bottom-right half: paragraph max-w-400 + `TALK TO A PARTNER` button. Right dark column, 4 items divide-y (current/20), each `lg:p-40 grid-cols-2 gap-60 min-h calc(50svh-60)`: [index mono caption-20 50% · h3 headline-10 2 lines · animated SVG illustration w-70%] · [paragraph · mono uppercase bullet list with 8px mint squares].
  Illustrations: 01 rotating dashed circle + two circles + 12 sweeping ellipses; 02 circle-masked bars + dashed outside + ellipses; 03 spiral of 48 dashed rays rotating; 04 (see DOM dump).
- **Clients `#clients`** overflow-clip. Top: 2-col min-h 65svh: left white (h2 `Clients` sticky, py-20) · right Dither canvas. Bottom: 2-col divide-x: left sticky 100svh-60 grid-cols-2: [eyebrow `WHO WE WORK WITH`; bottom: current client name flip + odometer `01 - 06`] [logo column: 6 stacked coloured panels 16.67% each, translateY to current] · [sticky text + `WORK WITH US`]. Right: `ul` divide-y of 6 `button` h-120 grid-cols-2 items-end p-12: h3 headline-10 · category mono caption-10 60%; active row = fg bg (scaleY origin-top 800ms) inverting text.
  Client brand colours: Headlands #004b87, Two Sigma #009aa6, Citadel #08225a, Vatic #262160, Syntria #03598c, PDT #365674.
- **Testimonials `#testimonials`** min-h 100svh-60, 4 cols divide-x — deck shuffled per visit, auto-advances every 6.7 s, bar h-4 fills over the interval `[measured]`: [col 1: rows-2: eyebrow + prev/next (h-60) · portrait (109% zoom, clip inset)] [cols 2-3: quote mark svg + headline-10 text; bottom: name + role mono 50% · odometer `01 - 09`] [col 4 rows-2: dark sticky Position/Company · Dither].
- **Team `#team`** rows-2 100svh-60: [h2 `Team` sticky · `Small team. / High Signal.` headline-10 bottom] [eyebrow `WHO YOU'LL ACTUALLY WORK WITH` + prev/next · paragraph]. Then horizontal snap slider `-mt-[40vh] -mb-[20vh] py-[20vh]`, cards basis (100%-3px)/4 aspect .8, each offset 20/55/35/70/40/25/60/45 % × f, f = clamp((sliderTop − 5vh)/95vh, −1, 1) `[measured]`, photo (cursor RGB-split shader), mint name button bottom (body-20, arrow), role tag top-right. Click opens modal.
- **Banner** `@container`, mt -60svh (overlaps team slider), min-h 100svh-60+60svh, Dither bg. Text 8.62cqw uppercase lh .9 white in black boxes: `Let's` · `Start` (ml 15cqw) · `Conversation` (white box black text) + mint square arrow button (size .9em+.8cqw) · `a`. Word odometers roll in.
- **Footer** lg h 100svh-60 rows-2 divide-y: [`Raise your / trajectory` headline-10 · links list · analog clocks NYC/LA (48px, 0.5 stroke) · email + Linkedin buttons h-60] [dark card: big wordmark svg (max-w-400) + `© 2026 Aspen Search • Privacy Policy` + `Website by Code Resolution` · mint CTA card `Let's start a / conversation` with 114px corner arrow, hover = dark card wipes in via clip-path 800ms ease-in-out].
- **Background** `SiteBgLogo`: fixed inset-0 z-1 pointer-events-none, logo svg w min(72vw,44rem) grey, rotateY = time·(-18°/s) + scroll-velocity kick `[measured -18.0°/s idle]`. Sits above the dither canvases (z-0) and below every `relative z-1` section.
- **Modal** drawer: fixed inset-0 z-10, backdrop black/60, panel right, lg max-w calc(50%+sbw/2) border-l, close 60×60 mint square outside the panel on lg (`-translate-x-[calc(100%+1px)]`). Contact: [Contact headline-20 · `Schedule a quick call` mint] [E: / T: rows h-60 with copy buttons · Linkedin · clocks] then dark `Upload CV` dropzone (.PDF .DOC .TXT · MAX SIZE_5MB). Team: photo hero (min-h 400, role tag, `Schedule a quick call` bottom-right half) · [dark name block · dither + spinning coin logo · Email/LinkedIn] · grey Bio.

## 5. Motion `[observed]` (headless sampling, 1440×900)
- Entrance `[measured]` per frame (`entrance_rec.json`): phase 1 = 0.8 s ease-in-out(.87,0,.13,1), outer wrapper
  opacity 0→1 + scale .4→1; phase 2 = 1.2 s same ease, inner scale .3→1 (the mark is the full-size background
  logo) simultaneously with the overlay wipe `clip-path: inset(0) → inset(0 100% 0 0)`; coin spin starts after.
- Text reveal (`AnimatedText`) `[measured]`: lines in `clip-path: inset(-0.25em 0)` masks, `translateY(100%)→0` +
  opacity 0→1, 1.0 s ease-out, 65 ms stagger, mask removed ~1.4 s after; triggers on viewport entry, once.
- Buttons: `before:` pseudo scale-x 0→1 origin-left 800ms ease-out; colour change 800ms.
- Nav links: bg block translate(0,100%+1px) → 0, 600ms ease-out, text colour → bg.
- Marquee: CSS translateX(-100%) 12.8s linear, duplicated content.
- Odometers: column of 0-9, translateY(-n em), 0.65s cubic-bezier(.16,1,.3,1).
- Theme toggle: `document.startViewTransition`, html gets `theme-sweep-ltr|rtl`, new snapshot clip-path sweeps 1.2s.
- Dither: perlin fbm (4 octaves, freq 3, amp .4, speed .006), smoothstep(.28,.72) pow 1.2, mixed #888→#e0e0e0,
  then 8×8 Bayer 2-colour dither at pixelSize 2 → pure black/white; cursor fluid trail dyed mint (#a1ffcb).
- Team photo shader: cursor trail RGB split + 30-cell grid displacement (`ShaderField`, source in bundle).

## 6. Responsive `[measured]`
- `lg` (1024) is the single structural breakpoint; `xl` (1280) moves the nav into the left header cell.
- Below lg: every 2-col becomes 1-col; hero becomes stacked: Aspen (pt-188) / Search / PLACING WINNERS / dark text
  card / mint card; stats stack; insights items stack with illustration max-w-200 at right; clients list only;
  testimonials single column with portrait 100px; team cards vertical list (gap-1); footer stacked.

## 7. SEO / a11y `[measured]`
- title "Aspen Search - Executive Search for Quantitative Finance & Tech", description, canonical, OG image 1200×630,
  favicon 64px png. Landmarks: header/main/footer; h1 in hero; dialogs with aria-modal + Escape; sr-only labels
  on odometers; `motion-reduce` variants everywhere; `data-keyboard-focus` mode.

## 8. Provenance
- Taken and shipped (local test only, per instruction): Suisse Intl/Mono woff2, team photos, testimonial photos,
  client logos, "recent hires" logos, copy (minus brand strings). Replaced: wordmark/mark (→ `//FF`), brand name,
  email/domain, credits. Not taken: their JS/CSS (behaviour re-implemented), Sanity, analytics, upload backend.
