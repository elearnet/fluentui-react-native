import { TurboModuleRegistry, type TurboModule, NativeModules } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
}

const isTurboModuleEnabled = global.__turboModuleProxy != null;

const TurboExample = isTurboModuleEnabled
  ? TurboModuleRegistry.getEnforcing<Spec>('TurboExample') // New Arch
  : NativeModules.TurboExample;                           // Old Arch

export default TurboExample as Spec;

// export default TurboModuleRegistry.getEnforcing<Spec>('TurboExample');
