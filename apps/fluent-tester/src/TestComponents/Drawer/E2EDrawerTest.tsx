import * as React from 'react';

import { Drawer } from '@elui-react-native/drawer';
import { Stack } from '@elui-react-native/stack';

import { stackStyle } from '../Common/styles';
export const E2EDrawerTest: React.FunctionComponent = () => {
  return (
    <Stack style={stackStyle}>
      <Drawer />
    </Stack>
  );
};
