import type { Theme } from '@elui-react-native/framework';
import { globalTokens } from '@elui-react-native/theme-tokens';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { MenuListTokens } from './MenuList.types';

export const defaultMenuListTokens: TokenSettings<MenuListTokens, Theme> = (t: Theme): MenuListTokens => ({
  paddingVertical: globalTokens.size40,
  minWidth: 128,
  maxWidth: 300,
  backgroundColor: t.colors.neutralBackground1,
  /* To account for the width of the vertical scrollView. With the default minWidth, some content may be cut off */
  hasMaxHeight: {
    minWidth: 140,
  },
});
