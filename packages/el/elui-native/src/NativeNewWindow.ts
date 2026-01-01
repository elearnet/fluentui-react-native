import { TurboModuleRegistry, type TurboModule,NativeModules } from 'react-native';

export interface Spec extends TurboModule {
  open(rescType: string, rescId: string, title:string): void;
}

const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NewWindow = isTurboModuleEnabled
  ? TurboModuleRegistry.getEnforcing<Spec>('NewWindow') // New Arch
  : NativeModules.NewWindow;                           // Old Arch
const moduleName = 'NewWindow';
export default NewWindow as Spec;
export {moduleName};
