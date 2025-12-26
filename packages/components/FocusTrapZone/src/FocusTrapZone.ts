/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 * @format
 */

import { useViewCommandFocus } from '@elui-react-native/interactive-hooks';
import type { IUseStyling } from '@eluifabricshared/foundation-composable';
import { composable } from '@eluifabricshared/foundation-composable';
import { mergeSettings } from '@eluifabricshared/foundation-settings';

import type { IFocusTrapZoneProps, IFocusTrapZoneSlotProps, IFocusTrapZoneType } from './FocusTrapZone.types';
import RCTFocusTrapZone from './FocusTrapZoneNativeComponent';

export function filterOutComponentRef(propName: string): boolean {
  return propName !== 'componentRef';
}

export const FocusTrapZone = composable<IFocusTrapZoneType>({
  usePrepareProps: (userProps: IFocusTrapZoneProps, useStyling: IUseStyling<IFocusTrapZoneType>) => {
    const ftzRef = useViewCommandFocus(userProps.componentRef);
    return {
      slotProps: mergeSettings<IFocusTrapZoneSlotProps>(useStyling(userProps), { root: { ...userProps, ref: ftzRef } }),
    };
  },
  slots: {
    root: { slotType: RCTFocusTrapZone, filter: filterOutComponentRef },
  },
});
