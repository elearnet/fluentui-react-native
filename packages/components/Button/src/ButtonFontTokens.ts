import type { Theme } from '@elui-react-native/framework';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { ButtonTokens } from './Button.types';

export const defaultButtonFontTokens: TokenSettings<ButtonTokens, Theme> = (_t: Theme) =>
  ({
    medium: {
      hasContent: {
        variant: 'bodySemibold',
      },
    },
    small: {
      hasContent: {
        variant: 'secondaryStandard',
      },
    },
    large: {
      variant: 'subheaderSemibold',
    },
  } as ButtonTokens);
