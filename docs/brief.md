# Build brief — FF Search (aspensearch.com rebuild under FF Dev Studio)

## Identity

- **Product name:** FF Search — hero reads `FF` / `Studio` / `PLACING WINNERS.`; long form `FF Dev Studio`
- **Owner / brand:** FF Dev Studio (Fakhrul's studio; mark = `//FF` from `~/Desktop/dev/ffdevstudio/brand-system`)
- **Whose site is the reference?** a third party's (Aspen Search, built by Code Resolution / Edoardo Lunardi).
  Fakhrul's instruction (2026-09-15): assets, images, fonts may be taken and reused — local test only,
  everything swaps before anything goes live. Branding changes Aspen → FF / FF Dev Studio. No questions asked.
- **Existing brand assets supplied?** logo (the `//FF` mark). Palette/type/imagery: reference's, by instruction.
- **Tone of the product voice:** terse, confident, editorial. Copy kept from the reference except brand strings
  (local test — copy is replaced before launch).

## Reference

- **Reference URL(s):** https://www.aspensearch.com/ (+ `/privacy-policy`, `?modal=contact`, team modals)
- **What specifically do we want from it:** the whole site — layout, motion, WebGL dither, shader image effect, modals
- **Access:** public surface only (no login exists)
- **Snapshot date:** 2026-09-15
- **Assets pulled to:** `docs/reference/2026-09-15/assets/` (manifest.tsv has the provenance); DOM dumps in
  `docs/reference/2026-09-15/dom/`, viewport captures in `shots/`, token JSON in `tokens/`

## Mode

- **Mode:** SITE (single page + modals; no auth, no persistent state except theme preference)

## Scope line

- **In scope:** 1. the single page with all 8 sections; 2. contact / team / privacy modals; 3. entrance + scroll
  motion, dither backgrounds, cursor shader on team photos, theme toggle with view-transition sweep
- **Explicitly NOT building:** Sanity CMS; Umami analytics; Vercel Blob CV upload backend (the upload UI is built,
  it accepts the file locally and shows the success state, nothing is sent anywhere); the `/api` routes
- **Parity target:** visual + interaction parity ("countless visual passes")

## Technical

- **Repo:** `~/Desktop/dev/AspenClone` (local, private)
- **Stack:** Vite 8 + React 19 + TypeScript + Tailwind v4 (reference's own token vocabulary) + motion + lenis + three.
  Chosen because the reference is a React/framer-motion/lenis/three app and its Tailwind class vocabulary is
  visible in the hydrated DOM — reproducing behaviour in the same idiom is the shortest path to exactness.
- **Auth / tenancy / data:** none
- **Hosting target:** none yet (local test). Dev on :3150.

## Environment and safety

- Safe to test freely: yes. No real email/payment/post. No deploy.

## Gates

- [x] Gate 1 — spec + tokens (docs/reference-spec.md) — proceeded without review per instruction
- [ ] Gate 2 — hero + header complete at desktop + mobile
- [ ] Gate 3 — full page + modals
- [ ] Gate 4 — verification passes, parity ledger, honest close
