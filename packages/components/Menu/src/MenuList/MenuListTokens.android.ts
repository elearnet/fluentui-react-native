import type { Theme } from '@elui-react-native/framework';
import { globalTokens } from '@elui-react-native/theme-tokens';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { MenuListTokens } from './MenuList.types';

export const defaultMenuListTokens: TokenSettings<MenuListTokens, Theme> = (t: Theme): MenuListTokens => ({
  backgroundColor: t.colors.neutralBackground1,
  borderRadius: globalTokens.corner.radius80,
  paddingVertical: globalTokens.size80,
});
