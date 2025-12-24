import type { Theme } from '@elui-react-native/framework';
import { buildUseTokens } from '@elui-react-native/framework';

import type { MenuPopoverTokens } from './MenuPopover.types';
import { menuPopoverName } from './MenuPopover.types';

export const useMenuPopoverTokens = buildUseTokens<MenuPopoverTokens>(
  (t: Theme) => ({ borderWidth: 1, borderColor: t.colors.neutralStrokeAccessible }),
  menuPopoverName,
);
