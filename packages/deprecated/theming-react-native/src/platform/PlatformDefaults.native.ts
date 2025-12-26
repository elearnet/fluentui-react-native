import { createThemeRegistry } from '@eluifabricshared/theme-registry';
import { resolvePartialTheme } from '@eluifabricshared/theming-ramp';

import type { IThemingModuleHelper } from '../NativeModule';
import { ThemingModuleHelper } from '../NativeModule';

/**
 * @deprecated
 */
export function createPlatformThemeRegistry(platformThemeId?: string, module: IThemingModuleHelper = ThemingModuleHelper) {
  const registry = createThemeRegistry(module.getPlatformDefaults(platformThemeId), resolvePartialTheme);
  module.addListener(() => {
    registry.updatePlatformDefaults(module.getPlatformDefaults(platformThemeId));
  });
  return registry;
}
