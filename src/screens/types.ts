import type { DetoxState } from '../lib/store';
import type { Tab } from '../App';

export interface ScreenProps {
  state: DetoxState;
  update: (patch: Partial<DetoxState> | ((s: DetoxState) => Partial<DetoxState>)) => void;
  reset: () => void;
  go?: (t: Tab) => void;
}
