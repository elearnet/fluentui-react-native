import type { ViewProps } from 'react-native';

import type { ShadowToken } from '@elui-react-native/theme-types';

export const shadowName = 'Shadow';

export interface ShadowProps extends ViewProps {
  shadowToken?: ShadowToken;
}
