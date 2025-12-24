import * as React from 'react';

import { ButtonV1 as Button } from '@elui/react-native';
import { Menu, MenuItem, MenuTrigger, MenuPopover, MenuList } from '@elui-react-native/menu';
import { Stack } from '@elui-react-native/stack';

import { stackStyle } from '../Common/styles';

export const MenuComponentOutsideMenuList: React.FunctionComponent = () => {
  return (
    <Stack style={stackStyle}>
      <Menu>
        <MenuTrigger>
          <Button>The Menu</Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>A plain MenuItem</MenuItem>
            <MenuItem>A plain MenuItem 2</MenuItem>
          </MenuList>
          <Button>Not in arrow loop</Button>
        </MenuPopover>
      </Menu>
    </Stack>
  );
};
