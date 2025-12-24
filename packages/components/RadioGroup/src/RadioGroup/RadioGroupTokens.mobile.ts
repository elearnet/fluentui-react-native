import type { Theme } from '@elui-react-native/framework';
import { globalTokens } from '@elui-react-native/theme-tokens';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { RadioGroupTokens } from './RadioGroup.types';

export const defaultRadioGroupTokens: TokenSettings<RadioGroupTokens, Theme> = (t: Theme) =>
  ({
    // Tokens taken from Android Popover
    color: t.colors.neutralForeground1,
    variant: 'body1Strong',
    requiredColor: globalTokens.color.darkRed.primary,
    requiredPadding: globalTokens.size20,
    flexDirection: 'column',
    disabled: {
      color: t.colors.neutralForegroundDisabled1,
    },
    isHorizontal: {
      flexDirection: 'row',
    },
  } as RadioGroupTokens);
