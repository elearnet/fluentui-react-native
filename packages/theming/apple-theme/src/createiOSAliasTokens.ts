import { memoize } from '@elui-react-native/framework-base';
import { getAliasTokens, getShadowTokens } from '@elui-react-native/theme-tokens';
import type { AliasColorTokens, AppearanceOptions } from '@elui-react-native/theme-types';
import type { ThemeShadowDefinition } from '@elui-react-native/theme-types';
import { mapPipelineToTheme, mapPipelineToShadow } from '@elui-react-native/theming-utils';

function createiOSColorAliasTokensWorker(mode: AppearanceOptions): AliasColorTokens {
  const aliasTokens = getAliasTokens(mode);
  return mapPipelineToTheme(aliasTokens);
}

export const createiOSColorAliasTokens = memoize(createiOSColorAliasTokensWorker);

function createiOSShadowAliasTokensWorker(mode: AppearanceOptions): ThemeShadowDefinition {
  const aliasTokens = getShadowTokens(mode);
  return mapPipelineToShadow(aliasTokens);
}

export const createiOSShadowAliasTokens = memoize(createiOSShadowAliasTokensWorker);
