import { useEffect, useRef, useState } from 'react';
import { daysSince, moneySaved, peso } from '../lib/store';
import type { ScreenProps } from './types';

/**
 * Honest share cards only. They celebrate time and money kept — never a
 * fake win or cash-out, which would work as an ad for real gambling.
 */
export default function Share({ state }: ScreenProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [showMoney, setShowMoney] = useState(true);
  const [status, setStatus] = useState('');
  const days = daysSince(state.quitDate);
  const saved = moneySaved(state);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    const W = 1080, H = 1350;
    c.width = W; c.height = H;

    ctx.fillStyle = '#0f1a17';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#7fd1a8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(W / 2, 520, 300, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, days / 30 || 0.02));
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f3e9d2';
    ctx.font = '800 260px Fraunces, Georgia, serif';
    ctx.fillText(String(days), W / 2, 600);
    ctx.font = '500 52px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#a9bdb4';
    ctx.fillText(days === 1 ? 'day scatter-free' : 'days scatter-free', W / 2, 690);

    if (showMoney && saved > 0) {
      ctx.fillStyle = '#7fd1a8';
      ctx.font = '700 96px Fraunces, Georgia, serif';
      ctx.fillText(peso(saved), W / 2, 960);
      ctx.fillStyle = '#a9bdb4';
      ctx.font = '500 44px Inter, system-ui, sans-serif';
      ctx.fillText('kept, not lost to the reels', W / 2, 1030);
    }

    ctx.fillStyle = '#f3e9d2';
    ctx.font = '600 40px Inter, system-ui, sans-serif';
    ctx.fillText('Scatter Detox', W / 2, 1220);
    ctx.fillStyle = '#6f857b';
    ctx.font = '400 30px Inter, system-ui, sans-serif';
    ctx.fillText('A recovery app · not a gambling app · no real winnings', W / 2, 1275);
  }, [days, saved, showMoney]);

  const share = async () => {
    const c = canvas.current;
    if (!c) return;
    const blob: Blob | null = await new Promise((r) => c.toBlob(r, 'image/png'));
    if (!blob) return;
    const file = new File([blob], `scatter-detox-day-${days}.png`, { type: 'image/png' });
    const text = `${days} days scatter-free. Kaya natin 'to. #ScatterDetox`;
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text });
        setStatus('Shared.');
        return;
      }
    } catch {
      /* user cancelled */
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
    setStatus('Saved the image. Post it anywhere you like.');
  };

  return (
    <>
      <p className="eyebrow">Share your progress</p>
      <h1 className="display">Proof you're winning the real game.</h1>
      <canvas ref={canvas} className="share-canvas" aria-label="Your progress card" />
      <label className="check">
        <input type="checkbox" checked={showMoney} onChange={(e) => setShowMoney(e.target.checked)} />
        <span>Show money kept</span>
      </label>
      <button className="btn primary block" onClick={share}>Share card</button>
      {status && <small className="muted">{status}</small>}
    </>
  );
}
