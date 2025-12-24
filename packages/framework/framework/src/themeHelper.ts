import type { Theme } from '@elui-react-native/theme-types';
import type { ThemeHelper } from '@elui-react-native/use-styling';

import { useFluentTheme } from './useFluentTheme';

export const themeHelper: ThemeHelper<Theme> = {
  useTheme: () => useFluentTheme(),
  getComponentInfo: (theme: Theme, name: string) => {
    const components = theme.components || {};
    return components[name];
  },
};
