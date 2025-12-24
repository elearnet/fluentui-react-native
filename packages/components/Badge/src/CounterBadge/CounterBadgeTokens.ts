import type { TokenSettings } from '@elui-react-native/framework';
import { globalTokens } from '@elui-react-native/theme-tokens';

import type { CounterBadgeTokens } from './CounterBadge.types';

export const counterBadgeTokens: TokenSettings<CounterBadgeTokens> = () =>
  ({
    shadowToken: undefined,
    dot: {
      width: 6,
      minHeight: 6,
      paddingHorizontal: 0,
      borderWidth: 0,
      borderRadius: globalTokens.corner.radiusCircular,
    },
  } as CounterBadgeTokens);
