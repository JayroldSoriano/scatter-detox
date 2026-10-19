import { useState } from 'react';
import type { ScreenProps } from './types';

export default function Onboarding({ update }: ScreenProps) {
  const [name, setName] = useState('');
  const [spend, setSpend] = useState('500');
  const [reason, setReason] = useState('');
  const [adult, setAdult] = useState(false);

  const ready = adult && Number(spend) > 0;

  return (
    <div className="app onboarding">
      <main className="screen">
        <p className="eyebrow">Scatter Detox</p>
        <h1 className="display">Ikaw ang may hawak.<br />Not the reels.</h1>
        <p className="muted">
          A private companion for quitting online slots. No real money, no accounts, nothing leaves your phone.
        </p>

        <label className="field">
          <span>What should we call you?</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" />
        </label>

        <label className="field">
          <span>On a typical day, how much did scatter cost you?</span>
          <div className="peso-input">
            <span>₱</span>
            <input inputMode="numeric" value={spend} onChange={(e) => setSpend(e.target.value.replace(/\D/g, ''))} />
          </div>
          <small className="muted">An honest guess is fine. We use it to count what you keep.</small>
        </label>

        <label className="field">
          <span>Your reason for stopping</span>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Para sa tuition ni bunso. I want my weekends back."
          />
        </label>

        <label className="check">
          <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
          <span>I'm 18 or older.</span>
        </label>

        <button
          className="btn primary block"
          disabled={!ready}
          onClick={() =>
            update({
              onboarded: true,
              name: name.trim(),
              dailySpend: Number(spend),
              reason: reason.trim(),
              quitDate: new Date().toISOString(),
            })
          }
        >
          Start day one
        </button>
      </main>
    </div>
  );
}
