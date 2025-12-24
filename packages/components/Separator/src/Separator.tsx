/** @jsxRuntime classic */
/** @jsx withSlots */
import { View } from 'react-native';

import type { UseSlots } from '@elui-react-native/framework';
import { compose, withSlots, mergeProps } from '@elui-react-native/framework';

import { stylingSettings } from './Separator.styling';
import type { SeparatorProps, SeparatorType } from './Separator.types';
import { separatorName } from './Separator.types';

const propMask = { vertical: undefined };

export const Separator = compose<SeparatorType>({
  displayName: separatorName,
  ...stylingSettings,
  slots: { root: View },
  useRender: (props: SeparatorProps, useSlots: UseSlots<SeparatorType>) => {
    const Root = useSlots(props).root;
    return (rest: SeparatorProps) => <Root {...mergeProps(props, rest, propMask)}>{rest.children}</Root>;
  },
});

export default Separator;
