import { describe, expect, it } from 'vitest';
import { measureRtp, seeded, spin } from './slotEngine';

describe('slot engine', () => {
  it('returns about 96% over the long run (house keeps ~4%)', () => {
    const rtp = measureRtp(2_000_000, seeded(42));
    console.log(`Measured RTP over 2M spins: ${(rtp * 100).toFixed(2)}%`);
    expect(rtp).toBeGreaterThan(0.93);
    expect(rtp).toBeLessThan(0.99);
  });

  it('a 500-spin session at ₱20 usually ends below the starting balance', () => {
    const rng = seeded(7);
    let losingSessions = 0;
    for (let s = 0; s < 2000; s++) {
      let net = 0;
      for (let i = 0; i < 500; i++) net += spin(20, rng).win - 20;
      if (net < 0) losingSessions++;
    }
    console.log(`Losing sessions: ${((losingSessions / 2000) * 100).toFixed(1)}%`);
    expect(losingSessions / 2000).toBeGreaterThan(0.5);
  });
});
