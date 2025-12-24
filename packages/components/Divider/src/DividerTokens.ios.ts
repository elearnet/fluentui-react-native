import { buildUseTokens } from '@elui-react-native/framework';
import type { Theme } from '@elui-react-native/framework';
import { globalTokens } from '@elui-react-native/theme-tokens';

import type { DividerTokens } from './Divider.types';

export const useDividerTokens = buildUseTokens<DividerTokens>((theme: Theme) => ({
  // base tokens
  insetSize: 0,
  lineColor: theme.colors.neutralStroke2,
  thickness: globalTokens.stroke.width05,
}));
