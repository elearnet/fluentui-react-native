/* eslint-disable */

import { Theme, PartialTheme } from '@elui-react-native/theme-types';
import { mergeSettingsCollection } from '@eluifabricshared/foundation-settings';
import { MergeOptions, immutableMergeCore } from '@elui-react-native/framework-base';

function _settingsHandler(...objs: (object | undefined)[]): object | undefined {
  return mergeSettingsCollection(...objs);
}

const _themeMergeOptions: MergeOptions = {
  object: true,
  settings: _settingsHandler,
};

/**
 * Resolve `partialTheme` into a fully specified theme, using `theme` to fill
 * in any missing values.
 */
export function resolvePartialTheme(theme: Theme, partialTheme?: PartialTheme): Theme {
  let newTheme = immutableMergeCore(_themeMergeOptions, theme, partialTheme) as Theme;
  if (newTheme === theme) {
    newTheme = { ...newTheme };
  }
  return newTheme;
}
