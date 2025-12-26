import { createThemeRegistry } from '@eluifabricshared/theme-registry';
import { resolvePartialTheme } from '@eluifabricshared/theming-ramp';

import { getBaselinePlatformTheme } from '../BaselinePlatformDefaults';
import type { IThemingModuleHelper } from '../NativeModule';

/**
 * @deprecated
 */
export function createPlatformThemeRegistry(_themeId?: string, _module?: IThemingModuleHelper) {
  return createThemeRegistry(getBaselinePlatformTheme(), resolvePartialTheme);
}
