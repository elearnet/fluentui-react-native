import React from 'react';

import { Callout } from '@elui-react-native/callout';
import { stagedComponent } from '@elui-react-native/framework';
import { mergeProps } from '@elui-react-native/framework';

import type { MenuCalloutProps } from './MenuCallout.types';
import { menuCalloutName } from './MenuCallout.types';

export const MenuCallout = stagedComponent((props: MenuCalloutProps) => {
  return (_rest: MenuCalloutProps, children: React.ReactNode) => {
    const mergedProps = mergeProps(props, _rest);

    return <Callout {...mergedProps}>{children}</Callout>;
  };
});

MenuCallout.displayName = menuCalloutName;

export default MenuCallout;
