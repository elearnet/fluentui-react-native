import type { Theme } from '@elui-react-native/framework';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { ButtonTokens } from './Button.types';

export const defaultButtonFontTokens: TokenSettings<ButtonTokens, Theme> = (t: Theme) =>
  ({
    medium: {
      fontSize: t.typography.variants.caption1Strong.size,
      fontFamily: t.typography.variants.caption1Strong.face,
      fontWeight: t.typography.variants.caption1Strong.weight,
    },
    small: {
      fontSize: t.typography.variants.caption1Strong.size,
      fontFamily: t.typography.variants.caption1Strong.face,
      fontWeight: t.typography.variants.caption1Strong.weight,
    },
    large: {
      fontSize: t.typography.variants.body1Strong.size,
      fontFamily: t.typography.variants.body1Strong.face,
      fontWeight: t.typography.variants.body1Strong.weight,
    },
  } as ButtonTokens);
