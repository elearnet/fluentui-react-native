export { default as CompatibleView } from './CompatibleViewNativeComponent';

import { getHostComponent } from 'react-native-nitro-modules';
const CompatibleNitroViewConfig = require('../nitrogen/generated/shared/json/CompatibleNitroViewConfig.json');
import type { CompatibleNitroViewMethods, CompatibleNitroViewProps } from './CompatibleNitroView.nitro';

export const CompatibleNitroView = getHostComponent<CompatibleNitroViewProps,CompatibleNitroViewMethods>(
  'CompatibleNitroView',
  () => {
    // if (!CompatibleNitroViewConfig.busEventTypes) {
    //   CompatibleNitroViewConfig.directEventTypes = CompatibleNitroViewConfig.directEventTypes || {};
    //   CompatibleNitroViewConfig.directEventTypes.onTick = {
    //     registrationName: 'onTick'
    //   };
    // }
    return CompatibleNitroViewConfig;
  }
);

