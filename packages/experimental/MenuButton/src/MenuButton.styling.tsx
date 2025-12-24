import type { UseStylingOptions } from '@elui-react-native/framework';

import type { MenuButtonProps, MenuButtonSlotProps, MenuButtonTokens } from './MenuButton.types';
import { menuButtonName } from './MenuButton.types';

export const stylingSettings: UseStylingOptions<MenuButtonProps, MenuButtonSlotProps, MenuButtonTokens> = {
  tokens: [menuButtonName],
};
