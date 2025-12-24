import { Text as RNText } from 'react-native';

import { filterTextProps } from '@elui-react-native/adapters';
import { foregroundColorTokens, textTokens } from '@elui-react-native/tokens';
import { compose } from '@uifabricshared/foundation-compose';

import { settings } from './Text.settings';
import { textName } from './Text.types';
import type { ITextType } from './Text.types';

export const Text = compose<ITextType>({
  displayName: textName,
  settings,
  slots: {
    root: { slotType: RNText, filter: filterTextProps },
  },
  styles: {
    root: [textTokens, foregroundColorTokens],
  },
});

export default Text;
