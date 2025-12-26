import type { ViewStyle } from 'react-native';

import type { IViewProps } from '@elui-react-native/adapters';
import type { Theme } from '@elui-react-native/framework';
import { styleFunction } from '@eluifabricshared/foundation-tokens';

import type { IPersonaTokens } from './Persona.types';

const _rootKeyProps: (keyof IPersonaTokens)[] = ['coinSize', 'size'];

function _buildRootStyle(tokenProps: IPersonaTokens): IViewProps {
  const rootStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const { coinSize } = tokenProps;
  if (coinSize && coinSize > 0) {
    rootStyle.height = coinSize;
    rootStyle.minWidth = coinSize;
  }

  return { style: rootStyle };
}

export const buildRootStyle = styleFunction<IViewProps, IPersonaTokens, Theme>(_buildRootStyle, _rootKeyProps);
