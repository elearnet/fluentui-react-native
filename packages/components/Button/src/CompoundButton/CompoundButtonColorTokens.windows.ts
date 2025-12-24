import { PlatformColor } from 'react-native';

import type { Theme } from '@elui-react-native/framework';
import { isHighContrast } from '@elui-react-native/theming-utils';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { CompoundButtonTokens } from './CompoundButton.types';

export const defaultCompoundButtonColorTokens: TokenSettings<CompoundButtonTokens, Theme> = (t: Theme): CompoundButtonTokens => {
  if (isHighContrast(t)) {
    return highContrastColors;
  }

  return {
    secondaryContentColor: t.colors.neutralForeground2,
    disabled: {
      secondaryContentColor: t.colors.neutralForegroundDisabled,
    },
    hovered: {
      secondaryContentColor: t.colors.neutralForeground2Hover,
    },
    focused: {
      secondaryContentColor: t.colors.neutralForeground2Hover,
    },
    pressed: {
      secondaryContentColor: t.colors.neutralForeground2Pressed,
    },
    primary: {
      secondaryContentColor: t.colors.neutralForegroundOnBrand,
      hovered: {
        secondaryContentColor: t.colors.neutralForegroundOnBrandHover,
      },
      focused: {
        secondaryContentColor: t.colors.neutralForegroundOnBrandHover,
      },
      pressed: {
        secondaryContentColor: t.colors.neutralForegroundOnBrandPressed,
      },
    },
    subtle: {
      secondaryContentColor: t.colors.neutralForeground2,
      hovered: {
        secondaryContentColor: t.colors.neutralForeground2Hover,
      },
      focused: {
        secondaryContentColor: t.colors.neutralForeground2Hover,
      },
      pressed: {
        secondaryContentColor: t.colors.neutralForeground2Pressed,
      },
    },
  };
};

const highContrastColors = {
  secondaryContentColor: PlatformColor('SystemColorButtonTextColor'),
  disabled: {
    secondaryContentColor: PlatformColor('SystemColorGrayTextColor'),
  },
  hovered: {
    secondaryContentColor: PlatformColor('SystemColorHighlightTextColor'),
  },
  focused: {
    secondaryContentColor: PlatformColor('SystemColorHighlightTextColor'),
  },
  pressed: {
    secondaryContentColor: PlatformColor('SystemColorHighlightTextColor'),
  },
};
