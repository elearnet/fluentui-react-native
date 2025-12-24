import { memoize } from '@elui-react-native/framework-base';
import { getAliasTokens, getShadowTokens } from '@elui-react-native/theme-tokens';
import type { AliasColorTokens, AppearanceOptions, ThemeShadowDefinition } from '@elui-react-native/theme-types';
import { mapPipelineToShadow, mapPipelineToTheme } from '@elui-react-native/theming-utils';

function createColorAliasTokensWorker(mode: AppearanceOptions): AliasColorTokens {
  const aliasTokens = getAliasTokens(mode);
  return mapPipelineToTheme(aliasTokens);
}

export const createColorAliasTokens = memoize(createColorAliasTokensWorker);

function createShadowAliasTokensWorker(mode: AppearanceOptions): ThemeShadowDefinition {
  const aliasTokens = getShadowTokens(mode);
  return mapPipelineToShadow(aliasTokens);
}

export const createShadowAliasTokens = memoize(createShadowAliasTokensWorker);
