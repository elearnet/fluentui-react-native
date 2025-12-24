import type { FontWeightValue, Theme } from '@elui-react-native/framework';
import { globalTokens } from '@elui-react-native/theme-tokens';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { MenuGroupHeaderTokens } from './MenuGroupHeader.types';

export const defaultMenuGroupHeaderTokens: TokenSettings<MenuGroupHeaderTokens, Theme> = (t): MenuGroupHeaderTokens => ({
  color: t.colors.disabledText,
  fontFamily: t.typography.families.primary,
  fontSize: 13,
  fontWeight: globalTokens.font.weight.regular as FontWeightValue,
  gap: globalTokens.size40,
  paddingHorizontal: 5,
  paddingVertical: 3,
});
