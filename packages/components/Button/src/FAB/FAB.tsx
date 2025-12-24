/** @jsxRuntime classic */
/** @jsx withSlots */
import type * as React from 'react';
import { Pressable } from 'react-native';

import type { UseSlots } from '@elui-react-native/framework';
import { compose } from '@elui-react-native/framework';
import { Icon } from '@elui-react-native/icon';
import { TextV1 as Text } from '@elui-react-native/text';

import type { FABProps, FABType } from './FAB.types';
import { fabName } from './FAB.types';

export const FAB = compose<FABType>({
  displayName: fabName,
  slots: {
    root: Pressable,
    icon: Icon,
    content: Text,
  },
  useRender: (_userProps: FABProps, _useSlots: UseSlots<FABType>) => {
    return (_final: FABProps, ..._children: React.ReactNode[]) => {
      return null; // Only implemented for mobile endpoints
    };
  },
});
