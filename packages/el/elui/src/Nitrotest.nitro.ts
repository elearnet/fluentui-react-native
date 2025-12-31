import type { HybridObject } from 'react-native-nitro-modules';

export interface Nitrotest
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  multiply(a: number, b: number): number;
}
