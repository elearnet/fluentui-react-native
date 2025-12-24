import { Appearance, NativeEventEmitter } from 'react-native';

import { NativeAppearanceAdditions } from '@elui-react-native/experimental-appearance-additions';
import { ThemeReference } from '@elui-react-native/theme';
import type { Theme } from '@elui-react-native/theme-types';

import { getBaseAppleThemeIOS } from './appleTheme.ios';

export function createAppleTheme(): ThemeReference {
  const appleThemeReference = new ThemeReference({} as Theme, () => {
    const isLightMode = Appearance.getColorScheme() === 'light';
    const isElevated = NativeAppearanceAdditions.userInterfaceLevel() === 'elevated';
    return getBaseAppleThemeIOS(isLightMode, isElevated);
  });

  Appearance.addChangeListener(() => {
    appleThemeReference.invalidate();
  });

  const eventEmitter = new NativeEventEmitter(NativeAppearanceAdditions);
  eventEmitter.addListener('appearanceChanged', (_newTraits) => {
    appleThemeReference.invalidate();
  });

  return appleThemeReference;
}
