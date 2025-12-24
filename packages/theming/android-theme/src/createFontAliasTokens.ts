import { memoize } from '@elui-react-native/framework-base';
import { getAliasTokens } from '@elui-react-native/theme-tokens';
import type { Variants } from '@elui-react-native/theme-types';
import { mapFontPipelineToTheme } from '@elui-react-native/theming-utils';

function createFontAliasTokensWorker(): Partial<Variants> {
  const aliasTokens = getAliasTokens('light');
  return mapFontPipelineToTheme(aliasTokens);
}

export const createFontAliasTokens = memoize(createFontAliasTokensWorker);
