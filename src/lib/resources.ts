/**
 * Philippine support lines. Verified October 2026 — re-check before each release.
 * Sources are listed in README.md.
 */
export interface HelpLine {
  name: string;
  detail: string;
  numbers: { label: string; tel: string }[];
}

export const HELP_LINES: HelpLine[] = [
  {
    name: 'National Problem Gambling Helpline',
    detail: 'PAGCOR, run with Seagulls Flock Organization. 24/7 confidential counseling and referrals to treatment.',
    numbers: [{ label: '(02) 8248-9568', tel: '+63282489568' }],
  },
  {
    name: 'NCMH Crisis Hotline',
    detail: 'National Center for Mental Health / DOH. 24/7, including holidays. Call if you feel hopeless or unsafe.',
    numbers: [
      { label: '1553 (landline, toll-free)', tel: '1553' },
      { label: '0919-057-1553', tel: '+639190571553' },
      { label: '0917-899-8727', tel: '+639178998727' },
    ],
  },
];

export const EXCLUSION_NOTE =
  'You or your family can ask PAGCOR to ban you from licensed gaming sites. Ask about exclusion when you call the PAGCOR helpline.';

export const TRIGGERS = ['Payday', 'Bored', 'Stressed', 'Saw an ad / post', 'Lost earlier', 'Late at night', 'Other'];
