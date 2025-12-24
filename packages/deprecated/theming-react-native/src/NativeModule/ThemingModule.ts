import { getThemingModule } from '@elui-react-native/win32-theme';

import { createThemingModuleHelper } from './ThemingModuleHelpers';

/**
 * @deprecated
 */
export const ThemingModuleHelper = createThemingModuleHelper(...getThemingModule());
