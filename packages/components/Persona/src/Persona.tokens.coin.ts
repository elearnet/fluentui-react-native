import type { IViewProps } from '@elui-react-native/adapters';
import type { Theme } from '@elui-react-native/framework';
import type { IPersonaCoinTokens } from '@elui-react-native/persona-coin';
import { buildRootStyles as buildPersonaCoinRootStyle } from '@elui-react-native/persona-coin';
import { styleFunction } from '@uifabricshared/foundation-tokens';

import type { IPersonaTokens } from './Persona.types';

const _coinStyleKeys: (keyof IPersonaTokens)[] = [
  'coinSize',
  'size',
  'horizontalIconAlignment',
  'verticalIconAlignment',
  'coinBackgroundColor',
];

function _buildCoinStyle(tokenProps: IPersonaTokens, theme: Theme): IViewProps {
  const { coinBackgroundColor, ...rest } = tokenProps;

  const personaCoinTokens: IPersonaCoinTokens = {
    ...rest,
    backgroundColor: coinBackgroundColor,
  };

  return buildPersonaCoinRootStyle(personaCoinTokens, theme);
}

export const buildCoinStyle = styleFunction<IViewProps, IPersonaTokens, Theme>(_buildCoinStyle, _coinStyleKeys);
