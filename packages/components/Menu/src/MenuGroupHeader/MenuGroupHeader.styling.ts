import type { Theme, UseStylingOptions } from '@elui-react-native/framework';
import { fontStyles } from '@elui-react-native/framework';
import { buildProps } from '@elui-react-native/framework';

import { menuGroupHeaderName } from './MenuGroupHeader.types';
import type { MenuGroupHeaderProps, MenuGroupHeaderTokens, MenuGroupHeaderSlotProps } from './MenuGroupHeader.types';
import { defaultMenuGroupHeaderTokens } from './MenuGroupHeaderTokens';

export const stylingSettings: UseStylingOptions<MenuGroupHeaderProps, MenuGroupHeaderSlotProps, MenuGroupHeaderTokens> = {
  tokens: [defaultMenuGroupHeaderTokens, menuGroupHeaderName],
  slotProps: {
    root: buildProps(
      (tokens: MenuGroupHeaderTokens, theme: Theme) => {
        return {
          color: tokens.color,
          style: {
            marginStart: tokens.gap,
            ...fontStyles.from(tokens, theme),
          },
        };
      },
      ['color'],
    ),
  },
};
