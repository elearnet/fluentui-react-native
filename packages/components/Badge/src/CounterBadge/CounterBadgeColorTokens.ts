import type { TokenSettings } from '@elui-react-native/framework';

import type { CounterBadgeTokens } from './CounterBadge.types';

export const defaultCounterBadgeColorTokens: TokenSettings<CounterBadgeTokens> = () =>
  ({
    // Android has separate tokens for CounterBadge, other platforms use Badge tokens.
  } as CounterBadgeTokens);
