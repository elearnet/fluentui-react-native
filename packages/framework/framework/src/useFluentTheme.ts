import { defaultFluentTheme } from '@elui-react-native/default-theme';
import type { Theme } from '@elui-react-native/theme-types';
import { useTheme } from '@elui-react-native/theme-types';

/**
 * Attempts to obtain a theme via the react context, failing that the default fluent theme will be returned. Used to ensure some theme
 * object is provided for looking up color (and other) theme values
 * @returns - a valid Theme object
 */
export function useFluentTheme(): Theme {
  return useTheme() || defaultFluentTheme;
}
