import { useState } from 'react';
import { daysSince, moneySaved, peso } from '../lib/store';
import type { ScreenProps } from './types';

const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365];

export default function Home({ state, update, go }: ScreenProps) {
  const days = daysSince(state.quitDate);
  const saved = moneySaved(state);
  const next = MILESTONES.find((m) => m > days) ?? days + 30;
  const prev = [...MILESTONES].reverse().find((m) => m <= days) ?? 0;
  const progress = (days - prev) / (next - prev);
  const resisted = state.urges.filter((u) => u.outcome === 'resisted').length;
  const [slipOpen, setSlipOpen] = useState(false);
  const [slipAmount, setSlipAmount] = useState('');

  return (
    <>
      <p className="eyebrow">{state.name ? `Hi, ${state.name}` : 'Today'}</p>

      <section className="hero-card">
        <div className="streak">
          <span className="display big">{days}</span>
          <span className="muted">{days === 1 ? 'day' : 'days'} scatter-free</span>
        </div>
        <div className="meter" aria-label={`Progress to ${next} days`}>
          <div style={{ width: `${Math.min(100, progress * 100)}%` }} />
        </div>
        <small className="muted">Next milestone: {next} days</small>
      </section>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-value">{peso(saved)}</span>
          <span className="muted">kept in your pocket</span>
        </div>
        <div className="stat">
          <span className="stat-value">{resisted}</span>
          <span className="muted">urges beaten</span>
        </div>
      </div>

      {state.reason && (
        <blockquote className="reason">
          <small className="eyebrow">Your reason</small>
          <p>{state.reason}</p>
        </blockquote>
      )}

      <button className="btn urge block" onClick={() => go?.('urge')}>
        I feel the urge right now
      </button>

      {!slipOpen ? (
        <button className="btn ghost block" onClick={() => setSlipOpen(true)}>
          I played again
        </button>
      ) : (
        <section className="card">
          <p><strong>A slip isn't the end.</strong> Most people who quit have a few. Logging it honestly is part of recovery.</p>
          <label className="field">
            <span>About how much did you lose?</span>
            <div className="peso-input">
              <span>₱</span>
              <input inputMode="numeric" value={slipAmount} onChange={(e) => setSlipAmount(e.target.value.replace(/\D/g, ''))} />
            </div>
          </label>
          <div className="btn-row">
            <button
              className="btn primary"
              onClick={() => {
                update((s) => ({
                  slips: [...s.slips, { at: new Date().toISOString(), amount: Number(slipAmount) || 0 }],
                  urges: [...s.urges, { at: new Date().toISOString(), outcome: 'slipped' }],
                  quitDate: new Date().toISOString(),
                }));
                setSlipOpen(false);
                setSlipAmount('');
              }}
            >
              Log it and restart my count
            </button>
            <button className="btn ghost" onClick={() => setSlipOpen(false)}>Cancel</button>
          </div>
          <small className="muted">If it feels out of control, the Help tab has people you can call 24/7.</small>
        </section>
      )}
    </>
  );
}
