import { Appearance } from 'react-native';

import type { ThemeShadowDefinition } from '@elui-react-native/theme-types';
import { getCurrentAppearance } from '@elui-react-native/theming-utils';

import { createiOSShadowAliasTokens } from './createiOSAliasTokens';

export function iOSShadows(): ThemeShadowDefinition {
  const appearance = Appearance.getColorScheme();
  const mode = getCurrentAppearance(appearance, 'light');
  return createiOSShadowAliasTokens(mode);
}
