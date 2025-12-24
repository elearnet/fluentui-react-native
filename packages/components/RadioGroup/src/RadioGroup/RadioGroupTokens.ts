import type { Theme } from '@elui-react-native/framework';
import { globalTokens } from '@elui-react-native/theme-tokens';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { RadioGroupTokens } from './RadioGroup.types';

export const defaultRadioGroupTokens: TokenSettings<RadioGroupTokens, Theme> = (t: Theme) =>
  ({
    color: t.colors.menuItemText,
    variant: 'subtitle2Strong',
    requiredColor: t.colors.redForeground3,
    requiredPadding: globalTokens.size40,
    flexDirection: 'column',
    disabled: {
      color: t.colors.neutralForegroundDisabled,
    },
    isHorizontal: {
      flexDirection: 'row',
    },
  } as RadioGroupTokens);
