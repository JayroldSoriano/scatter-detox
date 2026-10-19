# Design principles

Scatter Detox exists to help people stop playing online slots. Every feature is
checked against one question: **does this make it easier or harder to stop?**
These rules are non-negotiable, and they are also what LGU, NGO and clinical
partners will audit before funding or recommending the app.

## Never

- **No real money in or out.** No deposits, no cash-out, no prizes, no
  redeemable credits, no crypto, no "points" convertible to anything.
- **No fake wins or fake cash-outs.** Share cards show streaks and money kept,
  never a winning screen or withdrawal. A fake cash-out post works as an ad for
  real gambling sites.
- **No gambling ads or referral links.** No ad SDKs at all in the free app.
  (Google Play also bans gambling ads inside simulated-gambling apps.)
- **No coin packs or purchases inside the simulator.** We don't sell spins to
  people trying to stop spinning.
- **No casino reinforcement design.** No win sirens, coin showers, near-miss
  weighting, "almost!" animations, autoplay, turbo, or bonus-hype screens.
- **No tracking or data resale.** Local-first storage. No third-party analytics
  that identify users.

## Always

- **Show the real math.** The Reality Check runs a ~96% RTP engine (verified in
  `src/lib/slotEngine.test.ts`) and shows net loss in pesos, time spent, and
  wins that are actually losses ("returned ₱12 on a ₱20 bet").
- **Cap the simulator.** 100 spins per session, 3 sessions per day, then route
  to urge surfing. It is an educational tool, not a substitute habit.
- **Compassion on slips.** Logging a relapse restarts the count without shame
  and points to human help.
- **Human help one tap away.** PAGCOR's National Problem Gambling Helpline and
  the NCMH crisis line, with numbers re-verified before every release.
- **18+ only.** Age gate on first launch.

## Open questions for clinical review

- Is a capped simulator net helpful for every user, or should counselors be
  able to turn it off for specific clients?
- Which outcome measures (e.g. PGSI at intake and 90 days) should a partner
  pilot collect, and with what consent flow?
