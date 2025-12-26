import type { IThemeRegistry, IProcessTheme } from '@eluifabricshared/theme-registry';
import type { ITheme, IPartialTheme } from '@eluifabricshared/theming-ramp';

/**
 * @deprecated
 */
export type { ITheme, IPartialTheme } from '@eluifabricshared/theming-ramp';

/**
 * @deprecated
 */
export type IThemeDefinition = IPartialTheme | IProcessTheme<ITheme, IPartialTheme>;

/**
 * @deprecated
 */
export type ThemeRegistry = IThemeRegistry<ITheme, IPartialTheme>;
