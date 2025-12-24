import type { ThemeShadowDefinition, AppearanceOptions } from '@elui-react-native/theme-types';

import { getIsHighContrast } from './appleHighContrast.macos';
import { createMacOSShadowAliasTokens } from './createMacOSAliasTokens';

export function fallbackAppleShadows(mode: AppearanceOptions): ThemeShadowDefinition {
  return createMacOSShadowAliasTokens(mode, getIsHighContrast());
}
