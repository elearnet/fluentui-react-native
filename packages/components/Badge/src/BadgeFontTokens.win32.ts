import type { Theme } from '@elui-react-native/framework';
import { globalTokens } from '@elui-react-native/theme-tokens';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { BadgeTokens } from './Badge.types';

export const badgeFontTokens: TokenSettings<BadgeTokens, Theme> = (t: Theme) =>
  ({
    fontFamily: t.typography.families.primary,
    fontSize: globalTokens.font.size100,
    fontWeight: globalTokens.font.weight.regular,
    large: {
      fontSize: globalTokens.font.size200,
    },
    extraLarge: {
      fontSize: globalTokens.font.size200,
    },
  } as BadgeTokens);
