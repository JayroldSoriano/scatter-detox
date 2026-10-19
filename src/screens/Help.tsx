import { EXCLUSION_NOTE, HELP_LINES } from '../lib/resources';
import type { ScreenProps } from './types';

export default function Help({ reset }: ScreenProps) {
  return (
    <>
      <p className="eyebrow">Help, any hour</p>
      <h1 className="display">You don't have to do this alone.</h1>

      {HELP_LINES.map((line) => (
        <section className="card" key={line.name}>
          <h2>{line.name}</h2>
          <p className="muted">{line.detail}</p>
          <div className="call-list">
            {line.numbers.map((n) => (
              <a key={n.tel} className="btn primary" href={`tel:${n.tel}`}>Call {n.label}</a>
            ))}
          </div>
        </section>
      ))}

      <section className="card">
        <h2>Block yourself from gambling sites</h2>
        <p className="muted">{EXCLUSION_NOTE}</p>
        <p className="muted">Also: unlink e-wallets from any betting site, and ask someone you trust to hold your cards for a while.</p>
      </section>

      <section className="card subtle">
        <h2>Your data</h2>
        <p className="muted">Everything stays on this phone. No account, no ads, no tracking.</p>
        <button
          className="btn ghost"
          onClick={() => {
            if (confirm('Erase everything and start over?')) reset();
          }}
        >
          Erase my data
        </button>
      </section>
    </>
  );
}
