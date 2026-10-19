import { useEffect, useState } from 'react';
import { TRIGGERS } from '../lib/resources';
import { peso } from '../lib/store';
import type { ScreenProps } from './types';

const URGE_SECONDS = 10 * 60;
const BREATH = ['Breathe in', 'Hold', 'Breathe out', 'Hold'];

export default function Urge({ state, update, go }: ScreenProps) {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(URGE_SECONDS);
  const [trigger, setTrigger] = useState<string>();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (left === 0 && running) setRunning(false);
  }, [left, running]);

  const elapsed = URGE_SECONDS - left;
  const phase = BREATH[Math.floor(elapsed / 4) % 4];
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  const finish = () => {
    update((s) => ({ urges: [...s.urges, { at: new Date().toISOString(), outcome: 'resisted', trigger }] }));
    setDone(true);
    setRunning(false);
  };

  if (done) {
    return (
      <section className="center-stack">
        <p className="eyebrow">You rode it out</p>
        <h1 className="display">The urge passed.<br />You didn't.</h1>
        <p className="muted">That {peso(state.dailySpend)} is still yours.</p>
        <button className="btn primary block" onClick={() => go?.('home')}>Back to today</button>
      </section>
    );
  }

  return (
    <>
      <p className="eyebrow">Urge surfing</p>
      <h1 className="display">Cravings peak, then fade.</h1>
      <p className="muted">Most urges ease within 10 to 20 minutes. Stay with this screen and let it crest.</p>

      <div className={running ? 'breath running' : 'breath'} aria-live="polite">
        <div className="breath-ring" />
        <div className="breath-text">
          <span className="display big">{mm}:{ss}</span>
          <span>{running ? phase : 'Ready when you are'}</span>
        </div>
      </div>

      {!running && left === URGE_SECONDS && (
        <button className="btn primary block" onClick={() => setRunning(true)}>Start 10 minutes</button>
      )}

      <section className="card">
        <p><strong>What set it off?</strong> Naming it weakens it.</p>
        <div className="chips">
          {TRIGGERS.map((t) => (
            <button key={t} className={trigger === t ? 'chip on' : 'chip'} onClick={() => setTrigger(t)}>{t}</button>
          ))}
        </div>
      </section>

      {state.reason && (
        <blockquote className="reason">
          <small className="eyebrow">Remember why</small>
          <p>{state.reason}</p>
        </blockquote>
      )}

      {(running || left < URGE_SECONDS) && (
        <button className="btn primary block" onClick={finish}>The urge has passed</button>
      )}
      <button className="btn ghost block" onClick={() => go?.('reality')}>Show me what a session really costs</button>
      <button className="btn ghost block" onClick={() => go?.('help')}>Talk to someone now</button>
    </>
  );
}
