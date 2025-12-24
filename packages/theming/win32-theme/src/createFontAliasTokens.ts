import { memoize } from '@elui-react-native/framework-base';
import type { Variants } from '@elui-react-native/theme-types';
import { mapFontPipelineToTheme } from '@elui-react-native/theming-utils';

import { getOfficeAliasTokens } from './getOfficeTokens';

function createFontAliasTokensWorker(): Partial<Variants> {
  const aliasTokens = getOfficeAliasTokens('Colorful');
  return mapFontPipelineToTheme(aliasTokens);
}

export const createFontAliasTokens = memoize(createFontAliasTokensWorker);
