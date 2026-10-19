import { useCallback, useEffect, useState } from 'react';

/**
 * Local-first state. Everything stays on the device: no account, no tracking,
 * no ad SDKs. (A future opt-in sync for counselor programs would live behind
 * explicit consent — see docs/DESIGN_PRINCIPLES.md.)
 */

export interface UrgeLog {
  at: string; // ISO timestamp
  outcome: 'resisted' | 'slipped';
  trigger?: string;
}

export interface Slip {
  at: string;
  amount: number;
}

export interface DetoxState {
  onboarded: boolean;
  name: string;
  quitDate: string; // ISO date the current streak started
  dailySpend: number; // what they used to lose per day, in pesos
  reason: string; // their own "why"
  urges: UrgeLog[];
  slips: Slip[];
  simSessions: { at: string; wagered: number; net: number; spins: number }[];
}

const KEY = 'scatter-detox:v1';

export const initialState: DetoxState = {
  onboarded: false,
  name: '',
  quitDate: new Date().toISOString(),
  dailySpend: 500,
  reason: '',
  urges: [],
  slips: [],
  simSessions: [],
};

function load(): DetoxState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

function save(s: DetoxState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable (private mode, etc.) — app still works in memory */
  }
}

export function useDetox() {
  const [state, setState] = useState<DetoxState>(load);
  useEffect(() => save(state), [state]);

  const update = useCallback((patch: Partial<DetoxState> | ((s: DetoxState) => Partial<DetoxState>)) => {
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const reset = useCallback(() => setState({ ...initialState }), []);

  return { state, update, reset };
}

export function daysSince(iso: string, now = new Date()): number {
  const ms = now.getTime() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

/** Money not lost since the streak began, net of any recorded slips. */
export function moneySaved(s: DetoxState, now = new Date()): number {
  const days = daysSince(s.quitDate, now);
  const slipped = s.slips
    .filter((x) => new Date(x.at) >= new Date(s.quitDate))
    .reduce((sum, x) => sum + x.amount, 0);
  return Math.max(0, days * s.dailySpend - slipped);
}

export const peso = (n: number) =>
  '₱' + Math.round(n).toLocaleString('en-PH');
