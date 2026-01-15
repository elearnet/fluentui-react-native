/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 * @format
 */

import type { HostComponent, ViewProps } from 'react-native';

import type { /*DirectEventHandler, Int32,*/ WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

import type { UnsafeMixed } from './codegenTypes';
// Should be:
// import type { UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';

// Event payload for focus change events
// export type FocusChangeEvent = Readonly<{
//   // Index of the focused child (0-based, -1 for no focus)
//   focusedIndex: Int32;
//   // Native tag of the focused view (for direct native reference)
//   focusedTag: Int32;
// }>;

export interface NativeProps extends ViewProps {
  navigateAtEnd?: WithDefault<'NavigateStopAtEnds' | 'NavigateWrap' | 'NavigateContinue', 'NavigateStopAtEnds'>;
  defaultTabbableElement?: UnsafeMixed;
  focusZoneDirection?: WithDefault<'bidirectional' | 'vertical' | 'horizontal' | 'none', 'bidirectional'>;
  use2DNavigation?: boolean;
  tabKeyNavigation?: WithDefault<'None' | 'NavigateWrap' | 'NavigateStopAtEnds' | 'Normal', 'None'>;
  disabled?: boolean;
  isCircularNavigation?: boolean;
  isTabNavigation?: boolean;
  //onFocus?: DirectEventHandler<null>;
  navigationOrderInRenderOrder?: boolean;

  // Event emitted when focus changes to a different child
  //onFocusChange?: DirectEventHandler<FocusChangeEvent>;
}

export default codegenNativeComponent<NativeProps>('FocusZone') as HostComponent<NativeProps>;

