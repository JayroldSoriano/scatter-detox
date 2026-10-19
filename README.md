# Scatter Detox

A free recovery companion for Filipinos quitting online slot ("scatter") gambling.
A Tala Labs project.

## What it does

| Screen | Purpose |
| --- | --- |
| **Today** | Days scatter-free, money kept (from the user's own daily-spend estimate), urges beaten, their personal reason |
| **Urge** | 10-minute urge-surfing timer with paced breathing and trigger logging |
| **Reality** | Play-money slot running real ~96% RTP math. Shows net loss, wager total, time cost, and "wins" that are losses. Capped at 100 spins × 3 sessions/day |
| **Share** | Honest progress card (streak + money kept) via the native share sheet. Never a fake win |
| **Help** | One-tap calls to PAGCOR's problem gambling helpline and the NCMH crisis line; self-exclusion info; erase-my-data |

Read [docs/DESIGN_PRINCIPLES.md](docs/DESIGN_PRINCIPLES.md) before adding features.

## Stack

- React 18 + TypeScript + Vite
- PWA (installable, offline) via `vite-plugin-pwa`
- Capacitor for Android / iOS builds from the same code
- Local-first state in `localStorage`, no backend required for v0.1
- Vitest for the slot-math tests

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # verifies the engine's RTP (~96%)
npm run build
```

## Ship to phones

```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios          # macOS + Xcode required
npm run cap:sync
npx cap open android     # build/run from Android Studio
```

The PWA alone already installs on Android and iOS from the browser, so a pilot
can start before store review.

## Project layout

```
src/
  lib/slotEngine.ts      RTP-accurate 5x3 engine (+ tests)
  lib/store.ts           local state, streak and money-kept math
  lib/resources.ts       PH helplines — re-verify each release
  screens/               Onboarding, Home, Urge, Reality, Share, Help
docs/DESIGN_PRINCIPLES.md
```

## Roadmap

- **v0.2** Tagalog / Bisaya copy, daily check-in reminder, trigger insights
- **v0.3** Opt-in "accountability buddy" (a trusted person sees streak only)
- **v0.4** Partner dashboard for LGU/NGO counselors (Supabase, consent-based, anonymized aggregates)
- **v0.5** Counselor-assigned exercises and PGSI self-assessment at intake / 30 / 90 days

## Helpline sources (verified Oct 2026)

- PAGCOR National Problem Gambling Helpline, (02) 8248-9568 — [AGB, May 2026](https://agbrief.com/news/philippines/27/05/2026/pagcor-launches-24-7-problem-gambling-helpline/)
- NCMH crisis hotline 1553 / 0919-057-1553 / 0917-899-8727 — [Daily Tribune, Jan 2026](https://tribune.net.ph/2026/01/03/doh-mental-health-hotline-gets-nearly-1k-calls-during-holiday-season)
- PAGCOR exclusion requests by family — [Manila Bulletin, Jun 2025](https://mb.com.ph/2025/06/19/if-your-kin-is-addicted-to-scatter-report-it-to-pagcor-palace)
