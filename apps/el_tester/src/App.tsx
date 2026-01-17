/**
 * ContextualMenu Test for el_tester
 * Testing ContextualMenu component with FocusZone in Fabric
 */

import React from 'react';
import { ThemeProvider, ThemeReference } from '@elui-react-native/theme';
import { createAppleTheme } from '@elui-react-native/apple-theme';

//ContextualMenu Testing: not using theme is fine
//using theme: get Error: Exception in HostFunction: <unknown>
// import { default as AppRoot }  from "./ContextualMenuTesting";

//Callout Testing: not using theme or using theme is fine
// import { default as AppRoot } from "./CalloutTesting";
//Focuszone Testing: not using theme or using theme is fine
// import { default as AppRoot } from "./FocuszoneTesting";
//import { default as AppRoot }  from "./PlatformColorTesting";

import {default as AppRoot} from "./App.formacos"

const useTheme = true;
const baseTheme = createAppleTheme();
const customTheme = new ThemeReference(baseTheme, {
  components: {
    Tab:{
      indicatorThickness:0,
      backgroundColor:'red',
      // Note: Don't set borderRadius here - it overrides inline corner styles
      small:{
        indicatorMargin: 0,
        backgroundColor:'red',
        iconSize:11,
        stackMarginHorizontal:0,
        stackMarginVertical:0,
      },
      medium:{
        indicatorMargin: 0,
        iconSize:11,
        stackMarginHorizontal:0,
        stackMarginVertical:0,
      },
      large:{
        indicatorMargin: 0,
        iconSize:11,
        stackMarginHorizontal:0,
        stackMarginVertical:0,
      },
      // Selected state - this backgroundColor is used by inverted corners
      selected:{
        backgroundColor: 'grey', // Match your styles.detail.backgroundColor
      },
    }
  },
});

// // ============================================================================
// // Main App
// // ============================================================================

 function App(): React.JSX.Element {
  return useTheme?(
    <ThemeProvider theme={customTheme}>
      <AppRoot />
    </ThemeProvider>
  ):(
    <AppRoot />
  );
}
export default App;

//export { default } from "./CalloutTesting";
