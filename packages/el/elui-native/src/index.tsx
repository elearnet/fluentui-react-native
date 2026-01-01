import TurboExample from './NativeTurboExample';
export function multiply(a: number, b: number): number {
  return TurboExample.multiply(a, b);
}
import NewWindow, { moduleName} from './NativeNewWindow';

export function openNewWindow(rescType: string, rescId: string, title:string) : void {
  NewWindow.open(rescType,rescId,title);
}
export {moduleName as newWindowModuleName};

export { default as FbrViewExample } from './FbrViewExampleNativeComponent';
export { default as SysIcon } from './SysIconNativeComponent';
export { default as InvertedCorner } from './InvertedCornerNativeComponent';
export { default as HoverableView } from './HoverableViewNativeComponent';
export { default as SystemColors } from './NativeSystemColors';


import { getHostComponent } from 'react-native-nitro-modules';
import { NitroModules } from 'react-native-nitro-modules';

const ELUIConfig = require('../nitrogen/generated/shared/json/ELUI_TESTConfig.json');
import type { ELUI_TESTMethods, ELUI_TESTProps } from './ELUI_TEST.nitro';
import type { Nitrotest } from './Nitrotest.nitro';

export const ELUIView = getHostComponent<ELUI_TESTMethods, ELUI_TESTProps>(
  'ELUI_TEST',
  () => ELUIConfig
);

export const NitrotestHybridObject =
  NitroModules.createHybridObject<Nitrotest>('Nitrotest');

