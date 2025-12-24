import type { Theme } from '@elui-react-native/framework';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { ChipTokens } from './Chip.types';

export const chipFontTokens: TokenSettings<ChipTokens, Theme> = () =>
  ({
    variant: 'captionStandard',
    large: {
      variant: 'secondaryStandard',
    },
    extraLarge: {
      variant: 'secondaryStandard',
    },
  } as ChipTokens);
