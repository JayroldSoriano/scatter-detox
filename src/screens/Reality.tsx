import { useMemo, useRef, useState } from 'react';
import { expectedLoss, spin, SYMBOLS, type Grid, type SpinResult } from '../lib/slotEngine';
import { peso } from '../lib/store';
import type { ScreenProps } from './types';

const BETS = [10, 20, 50];
const MAX_SPINS = 100;
const MAX_SESSIONS_PER_DAY = 3;
const REAL_SECONDS_PER_SPIN = 3; // typical online slot pace with quick-spin on

const blankGrid: Grid = Array.from({ length: 5 }, () => ['10', 'J', 'Q']) as Grid;

export default function Reality({ state, update, go }: ScreenProps) {
  const today = new Date().toDateString();
  const sessionsToday = state.simSessions.filter((s) => new Date(s.at).toDateString() === today).length;

  const [deposit, setDeposit] = useState(Math.max(100, state.dailySpend));
  const [bet, setBet] = useState(20);
  const [active, setActive] = useState(false);
  const [balance, setBalance] = useState(0);
  const [wagered, setWagered] = useState(0);
  const [spins, setSpins] = useState(0);
  const [path, setPath] = useState<number[]>([]);
  const [last, setLast] = useState<SpinResult>();
  const [grid, setGrid] = useState<Grid>(blankGrid);
  const [spinning, setSpinning] = useState(false);
  const [ended, setEnded] = useState(false);
  const timer = useRef<number>();

  const net = balance - deposit;

  const start = () => {
    setActive(true);
    setEnded(false);
    setBalance(deposit);
    setWagered(0);
    setSpins(0);
    setPath([deposit]);
    setLast(undefined);
    setGrid(blankGrid);
  };

  const end = (finalBalance = balance, finalWagered = wagered, finalSpins = spins) => {
    setEnded(true);
    setActive(false);
    update((s) => ({
      simSessions: [
        ...s.simSessions,
        { at: new Date().toISOString(), wagered: finalWagered, net: finalBalance - deposit, spins: finalSpins },
      ],
    }));
  };

  const doSpin = () => {
    if (spinning || balance < bet) return;
    setSpinning(true);
    const r = spin(bet);
    timer.current = window.setTimeout(() => {
      const nb = balance - bet + r.win;
      const nw = wagered + bet;
      const ns = spins + 1;
      setGrid(r.grid);
      setLast(r);
      setBalance(nb);
      setWagered(nw);
      setSpins(ns);
      setPath((p) => [...p, nb]);
      setSpinning(false);
      if (ns >= MAX_SPINS || nb < Math.min(...BETS)) end(nb, nw, ns);
    }, 650);
  };

  /** Skip ahead: play out the rest of the session instantly so the trend is visible. */
  const fastForward = () => {
    let b = balance, w = wagered, n = spins;
    const p: number[] = [];
    while (n < MAX_SPINS && b >= bet) {
      const r = spin(bet);
      b = b - bet + r.win;
      w += bet;
      n++;
      p.push(b);
    }
    setBalance(b);
    setWagered(w);
    setSpins(n);
    setPath((old) => [...old, ...p]);
    end(b, w, n);
  };

  if (!active && !ended && sessionsToday >= MAX_SESSIONS_PER_DAY) {
    return (
      <section className="center-stack">
        <p className="eyebrow">Reality check</p>
        <h1 className="display">That's enough reels for today.</h1>
        <p className="muted">This tool is for seeing the math, not for filling the time. If the urge is still loud, ride it out.</p>
        <button className="btn primary block" onClick={() => go?.('urge')}>Start urge surfing</button>
      </section>
    );
  }

  if (ended) {
    const minutes = Math.round((spins * REAL_SECONDS_PER_SPIN) / 60);
    return (
      <>
        <p className="eyebrow">Session summary · play money</p>
        <h1 className="display">{net < 0 ? `${peso(-net)} gone` : `${peso(net)} up, for now`}</h1>
        <BalanceChart path={path} start={deposit} />
        <dl className="ledger">
          <div><dt>Spins</dt><dd>{spins}</dd></div>
          <div><dt>Total wagered</dt><dd>{peso(wagered)}</dd></div>
          <div><dt>Average loss at 96% RTP</dt><dd>{peso(expectedLoss(wagered))}</dd></div>
          <div><dt>Real-world time</dt><dd>~{minutes} min</dd></div>
        </dl>
        <section className="card">
          {net < 0 ? (
            <p>On a real site that was <strong>{peso(-net)}</strong> in about {minutes} minutes. The house didn't need luck. It only needed you to keep spinning.</p>
          ) : (
            <p>You finished ahead this time. That's how slots keep people playing: short streaks happen, but every spin still costs about 4% on average. Over enough spins, the balance goes one way.</p>
          )}
        </section>
        <button className="btn primary block" onClick={() => go?.('home')}>Back to my streak</button>
        <button className="btn ghost block" onClick={() => setEnded(false)}>Done</button>
      </>
    );
  }

  if (!active) {
    return (
      <>
        <p className="eyebrow">Reality check · play money only</p>
        <h1 className="display">See what the reels really do.</h1>
        <p className="muted">
          Same math as real online slots: about ₱96 back for every ₱100 bet, on average. No real money. No cash-out.
          Watch the balance, not the lights.
        </p>
        <label className="field">
          <span>Pretend deposit</span>
          <div className="peso-input">
            <span>₱</span>
            <input inputMode="numeric" value={deposit} onChange={(e) => setDeposit(Number(e.target.value.replace(/\D/g, '')) || 0)} />
          </div>
        </label>
        <div className="field">
          <span>Bet per spin</span>
          <div className="chips">
            {BETS.map((b) => (
              <button key={b} className={bet === b ? 'chip on' : 'chip'} onClick={() => setBet(b)}>{peso(b)}</button>
            ))}
          </div>
        </div>
        <button className="btn primary block" disabled={deposit < bet} onClick={start}>Start a {MAX_SPINS}-spin session</button>
        <small className="muted">{MAX_SESSIONS_PER_DAY - sessionsToday} of {MAX_SESSIONS_PER_DAY} sessions left today.</small>
      </>
    );
  }

  return (
    <>
      <div className="hud">
        <div><small>Balance</small><strong>{peso(balance)}</strong></div>
        <div><small>Wagered</small><strong>{peso(wagered)}</strong></div>
        <div className={net < 0 ? 'neg' : ''}><small>Net</small><strong>{net >= 0 ? '+' : '−'}{peso(Math.abs(net))}</strong></div>
      </div>

      <div className={spinning ? 'reels spinning' : 'reels'} role="img" aria-label="Slot reels">
        {grid.map((reel, i) => (
          <div className="reel" key={i}>
            {reel.map((sym, j) => (
              <div key={j} className={`sym sym-${sym}${j === 1 ? ' payrow' : ''}`}>{SYMBOLS[sym].label}</div>
            ))}
          </div>
        ))}
      </div>

      <SpinOutcome result={last} bet={bet} />

      <button className="btn primary block" onClick={doSpin} disabled={spinning || balance < bet}>
        Spin {peso(bet)}
      </button>
      <div className="btn-row">
        <button className="btn ghost" onClick={fastForward}>Play out the rest instantly</button>
        <button className="btn ghost" onClick={() => end()}>Stop here</button>
      </div>
      <small className="muted">Spin {spins} of {MAX_SPINS} · Expected loss so far: {peso(expectedLoss(wagered))}</small>
    </>
  );
}

function SpinOutcome({ result, bet }: { result?: SpinResult; bet: number }) {
  if (!result) return <p className="outcome muted">Pays on the middle row, plus 3+ ✦ anywhere.</p>;
  const delta = result.win - bet;
  if (result.win === 0) return <p className="outcome">No return. −{peso(bet)}</p>;
  if (delta < 0)
    return (
      <p className="outcome">
        Returned {peso(result.win)} on a {peso(bet)} bet. <strong>That's still a loss of {peso(-delta)}.</strong>{' '}
        Real slots celebrate these.
      </p>
    );
  return <p className="outcome">Returned {peso(result.win)}. +{peso(delta)} this spin.</p>;
}

function BalanceChart({ path, start }: { path: number[]; start: number }) {
  const { d, baseY } = useMemo(() => {
    const w = 320, h = 120;
    const max = Math.max(start, ...path);
    const min = Math.min(0, ...path);
    const x = (i: number) => (i / Math.max(1, path.length - 1)) * w;
    const y = (v: number) => h - ((v - min) / Math.max(1, max - min)) * h;
    return {
      d: path.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' '),
      baseY: y(start),
    };
  }, [path, start]);
  return (
    <svg className="chart" viewBox="0 0 320 120" preserveAspectRatio="none" role="img" aria-label="Balance over the session">
      <line x1="0" x2="320" y1={baseY} y2={baseY} className="chart-base" />
      <path d={d} className="chart-line" />
    </svg>
  );
}
