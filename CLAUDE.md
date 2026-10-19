# Scatter Detox — Claude Code handoff

A free recovery companion for Filipinos quitting online slot ("scatter") gambling.
Tala Labs project, owner Jayrold Soriano. Users are 18+ adults in the Philippines.

**Read `docs/DESIGN_PRINCIPLES.md` before changing any feature.** Those rules are
the product: partners (LGUs, NGOs, CSR sponsors) fund it because it never acts
like a casino. If a request conflicts with them, stop and flag it.

## Hard rules (never break, even if asked casually)

- No real money in or out: no deposits, cash-out, prizes, redeemable credits.
- No fake wins or fake cash-out screens, and no share card that looks like a win.
  Share cards show streak + money kept only, with the "not a gambling app" line.
- No ad SDKs, no gambling links, no in-app purchases inside the simulator.
- No casino reinforcement: no win sounds, coin showers, near-miss weighting,
  autoplay, turbo, or bonus hype. Keep the Reality screen visually muted.
- Simulator stays capped: 100 spins/session, 3 sessions/day (`Reality.tsx` constants).
- Keep the engine near 96% RTP. `npm test` must pass after any paytable change.
- Local-first: no third-party analytics that identify users. Any future sync is
  opt-in with consent (Data Privacy Act, register with NPC before a dashboard).
- Helpline numbers in `src/lib/resources.ts` must be re-verified before each release.

## Stack and commands

React 18 + TypeScript + Vite 5, PWA via `vite-plugin-pwa`, Capacitor for native,
Vitest for tests. Node 20+.

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # slot-engine RTP + session-loss tests (~15s)
npm run build        # tsc + vite build → dist/
npm run cap:sync     # build then copy into native projects
```

First native build (not yet done; `android/` and `ios/` are gitignored):

```bash
npm install @capacitor/android @capacitor/ios
npx cap add android && npm run cap:sync && npx cap open android
npx cap add ios      # macOS + Xcode only
```

## Layout

```
src/
  App.tsx                 tab shell (Today, Urge, Reality, Share, Help); no router
  lib/slotEngine.ts       5x3 engine, middle-row line pays + scatter pays, seeded PRNG
  lib/slotEngine.test.ts  measures RTP over 2M spins; asserts 93–99%
  lib/store.ts            useDetox() hook, localStorage key scatter-detox:v1, streak/money math
  lib/resources.ts        PH helplines, PAGCOR exclusion note, urge triggers
  screens/                Onboarding, Home, Urge, Reality, Share, Help (+ types.ts)
  styles.css              all styles; CSS variables at :root, mobile-first, max-width 520px
docs/DESIGN_PRINCIPLES.md
```

Conventions: function components, no state library, no CSS framework. Copy is
English with light Taglish; keep it warm and non-shaming (slips restart the
count without judgment). Peso amounts go through `peso()` in `store.ts`.

## Current state (Oct 19, 2026)

- v0.1 scaffold done and pushed. Build and tests pass. Screens checked at 390px.
- Theoretical RTP 96.2%; a 2M-spin seeded run measures ~97.8% (high-variance top pays).
- Not yet run on a real device or as an installed PWA.
- Fonts load from Google Fonts, so first load needs a connection.

## Next tasks, in order

1. Run `npm run dev` locally, click through every tab on a phone (same Wi-Fi:
   `npm run dev -- --host`). Fix anything broken.
2. Generate PNG app icons (192, 512, maskable) from `public/icon.svg` and add them
   to the PWA manifest in `vite.config.ts`; Android installs need PNGs.
3. Self-host the two fonts so the app works fully offline.
4. Android build via Capacitor → debug APK for demos to Seagulls Flock / LGUs.
5. Tagalog copy: move strings into `src/lib/i18n.ts`, add an EN/TL toggle on Help.
6. Daily check-in reminder (Capacitor Local Notifications), off by default.
7. Roadmap after that (see README): accountability buddy, partner codes,
   consent-based counselor dashboard (Supabase), PGSI check-ins at 0/30/90 days.

## Business context

Monetization is institutional, never user-facing: LGU licenses, NGO clinical
partners, CSR sponsorship from e-wallets/banks, employer wellness seats.
No money from gambling operators or affiliates. The plan lives in a separate doc
(not in this repo); ask Jayrold for it if a task needs pricing or partner details.

## Public-facing materials

Never name Jayrold's client projects in store listings, pitch copy or READMEs.
His own ventures (Graduhan, PickleEye, MacShift, Scatter Detox) can be named.
