import * as React from 'react';

import { ButtonV1 as Button } from '@elui/react-native';
import { Menu, MenuItem, MenuTrigger, MenuPopover, MenuList } from '@elui-react-native/menu';
import { Stack } from '@elui-react-native/stack';

import { stackStyle } from '../Common/styles';

export const MenuTriggerChildRef: React.FunctionComponent = () => {
  const ref = React.useRef(null);
  const onClick = React.useCallback(() => {
    ref?.current?.focus();
  }, [ref]);

  return (
    <Stack style={stackStyle}>
      <Button onClick={onClick}>Click to focus Menu trigger</Button>

      <Menu>
        <MenuTrigger>
          <Button componentRef={ref}>The Menu</Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>A plain MenuItem</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </Stack>
  );
};
