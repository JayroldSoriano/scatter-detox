/**
 * Reality-check slot engine.
 *
 * This is NOT a game to win at. It reproduces the math of a typical online
 * "scatter" slot (≈96% return-to-player) so users can watch, in pesos, how a
 * session drains a balance over time. Nothing here is tuned to feel exciting:
 * no near-miss weighting, no "almost" animations, no bonus hype.
 *
 * Theoretical RTP of this paytable: 96.2% (exact; see slotEngine.test.ts).
 *
 * Model: 5 reels x 3 rows. Pays on the middle row (left-to-right, 3+ in a row)
 * plus scatter pays for 3+ scatters anywhere on screen.
 */

export type SymbolId = '10' | 'J' | 'Q' | 'K' | 'A' | 'GEM' | 'CROWN' | 'SCATTER';

export const SYMBOLS: Record<SymbolId, { label: string; weight: number }> = {
  '10': { label: '10', weight: 22 },
  J: { label: 'J', weight: 20 },
  Q: { label: 'Q', weight: 18 },
  K: { label: 'K', weight: 15 },
  A: { label: 'A', weight: 12 },
  GEM: { label: '◆', weight: 7 },
  CROWN: { label: '♛', weight: 4 },
  SCATTER: { label: '✦', weight: 4 },
};

/** Multipliers of the bet for 3 / 4 / 5 of a kind on the middle row. */
export const PAYTABLE: Record<Exclude<SymbolId, 'SCATTER'>, [number, number, number]> = {
  '10': [5, 12, 60],
  J: [6, 20, 80],
  Q: [7, 25, 100],
  K: [12, 35, 160],
  A: [20, 60, 300],
  GEM: [50, 180, 700],
  CROWN: [120, 500, 2500],
};

/** Scatter pays (multiplier of bet) for 3 / 4 / 5+ scatters anywhere. */
export const SCATTER_PAYS: [number, number, number] = [12, 90, 1000];

export const REELS = 5;
export const ROWS = 3;

export type Grid = SymbolId[][]; // grid[reel][row]

export interface SpinResult {
  grid: Grid;
  win: number; // pesos returned to balance (0 if loss)
  lineWin: number;
  scatterWin: number;
  scatterCount: number;
}

const ENTRIES = Object.entries(SYMBOLS) as [SymbolId, { weight: number }][];
const TOTAL_WEIGHT = ENTRIES.reduce((s, [, v]) => s + v.weight, 0);

function pick(rng: () => number): SymbolId {
  let r = rng() * TOTAL_WEIGHT;
  for (const [id, { weight }] of ENTRIES) {
    r -= weight;
    if (r < 0) return id;
  }
  return '10';
}

export function spin(bet: number, rng: () => number = Math.random): SpinResult {
  const grid: Grid = Array.from({ length: REELS }, () =>
    Array.from({ length: ROWS }, () => pick(rng)),
  );

  // Middle-row line win. Scatter does not substitute for other symbols.
  const middle = grid.map((reel) => reel[1]);
  const first = middle[0];
  let lineWin = 0;
  if (first !== 'SCATTER') {
    let run = 1;
    while (run < REELS && middle[run] === first) run++;
    if (run >= 3) lineWin = PAYTABLE[first][run - 3] * bet;
  }

  const scatterCount = grid.flat().filter((s) => s === 'SCATTER').length;
  const scatterWin = scatterCount >= 3 ? SCATTER_PAYS[Math.min(scatterCount, 5) - 3] * bet : 0;

  return { grid, win: lineWin + scatterWin, lineWin, scatterWin, scatterCount };
}

/** Long-run return to player, measured by simulation. */
export function measureRtp(spins: number, rng: () => number = Math.random): number {
  let paid = 0;
  for (let i = 0; i < spins; i++) paid += spin(1, rng).win;
  return paid / spins;
}

/** Expected peso loss for a given amount wagered at the target RTP. */
export const TARGET_RTP = 0.96;
export function expectedLoss(totalWagered: number): number {
  return totalWagered * (1 - TARGET_RTP);
}

/** Deterministic PRNG for tests (mulberry32). */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
