import { Appearance } from 'react-native';

import type { Theme } from '@elui-react-native/framework';
import { globalTokens } from '@elui-react-native/theme-tokens';
import type { TokenSettings } from '@elui-react-native/use-styling';

import type { SpinnerTokens } from './Spinner.types';
export const defaultSpinnerTokens: TokenSettings<SpinnerTokens, Theme> = () =>
  ({
    trackColor: Appearance.getColorScheme() === 'light' ? globalTokens.color.grey56 : globalTokens.color.grey72,
  } as SpinnerTokens);
