import { memoize } from '@elui-react-native/framework-base';
import type { AliasColorTokens, AppearanceOptions } from '@elui-react-native/theme-types';
import type { ThemeShadowDefinition } from '@elui-react-native/theme-types';
import { mapPipelineToTheme, mapPipelineToShadow } from '@elui-react-native/theming-utils';

import { getMacOSAliasTokens, getMacOSShadowTokens } from './getMacOSTokens';

function createMacOSColorAliasTokensWorker(mode: AppearanceOptions, isHighContrast: boolean): AliasColorTokens {
  const aliasTokens = getMacOSAliasTokens(mode, isHighContrast);
  return mapPipelineToTheme(aliasTokens);
}

export const createMacOSColorAliasTokens = memoize(createMacOSColorAliasTokensWorker);

function createMacOSShadowAliasTokensWorker(mode: AppearanceOptions, isHighContrast: boolean): ThemeShadowDefinition {
  const aliasTokens = getMacOSShadowTokens(mode, isHighContrast);
  return mapPipelineToShadow(aliasTokens);
}

export const createMacOSShadowAliasTokens = memoize(createMacOSShadowAliasTokensWorker);
