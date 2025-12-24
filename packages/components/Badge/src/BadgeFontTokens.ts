import type { Theme } from '@elui-react-native/framework';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { BadgeTokens } from './Badge.types';

export const badgeFontTokens: TokenSettings<BadgeTokens, Theme> = () =>
  ({
    variant: 'captionStandard',
    large: {
      variant: 'secondaryStandard',
    },
    extraLarge: {
      variant: 'secondaryStandard',
    },
  } as BadgeTokens);
