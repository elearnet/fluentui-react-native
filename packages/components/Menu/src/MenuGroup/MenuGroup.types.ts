import type { ViewProps } from 'react-native';

import type { IViewProps } from '@elui-react-native/adapters';
import type { FocusZoneProps } from '@elui-react-native/focus-zone';
import type { LayoutTokens } from '@elui-react-native/tokens';

export const menuGroupName = 'MenuGroup';

export type MenuGroupTokens = LayoutTokens;

export type MenuGroupProps = IViewProps;

export interface MenuGroupSlotProps {
  root: ViewProps;
  contentWrapper: FocusZoneProps;
}

export interface MenuGroupType {
  props: MenuGroupProps;
  tokens: MenuGroupTokens;
  slotProps: MenuGroupSlotProps;
}
