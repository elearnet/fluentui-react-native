import type { Theme } from '@elui-react-native/framework';
import { globalTokens } from '@elui-react-native/theme-tokens';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { MenuListTokens } from './MenuList.types';

export const defaultMenuListTokens: TokenSettings<MenuListTokens, Theme> = (t: Theme): MenuListTokens => ({
  padding: 5, // hardcoded for now to match NSMenu
  backgroundColor: t.colors.transparentBackground,
  gap: globalTokens.size20,
});
