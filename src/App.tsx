import { useState } from 'react';
import { useDetox } from './lib/store';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Urge from './screens/Urge';
import Reality from './screens/Reality';
import Share from './screens/Share';
import Help from './screens/Help';

export type Tab = 'home' | 'urge' | 'reality' | 'share' | 'help';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Today', icon: '◐' },
  { id: 'urge', label: 'Urge', icon: '≋' },
  { id: 'reality', label: 'Reality', icon: '▦' },
  { id: 'share', label: 'Share', icon: '↗' },
  { id: 'help', label: 'Help', icon: '☏' },
];

export default function App() {
  const detox = useDetox();
  const [tab, setTab] = useState<Tab>('home');

  if (!detox.state.onboarded) return <Onboarding {...detox} />;

  return (
    <div className="app">
      <main className="screen">
        {tab === 'home' && <Home {...detox} go={setTab} />}
        {tab === 'urge' && <Urge {...detox} go={setTab} />}
        {tab === 'reality' && <Reality {...detox} go={setTab} />}
        {tab === 'share' && <Share {...detox} />}
        {tab === 'help' && <Help {...detox} />}
      </main>
      <nav className="tabbar" aria-label="Main">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'tab active' : 'tab'}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            <span className="tab-icon" aria-hidden>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
