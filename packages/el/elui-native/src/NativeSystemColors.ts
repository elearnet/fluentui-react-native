import { TurboModuleRegistry, type TurboModule, NativeModules } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Get a single system color by name.
   * @param colorName - The NSColor name (e.g., 'windowBackgroundColor', 'labelColor')
   * @returns Hex color string (e.g., '#ECECEC') or null if not found
   */
  getSystemColor(colorName: string): string | null;

  /**
   * Get all common system colors as a dictionary.
   * @returns Object mapping color names to hex color strings
   */
  getSystemColors(): { [key: string]: string };
}

const isTurboModuleEnabled = global.__turboModuleProxy != null;

const SystemColors = isTurboModuleEnabled
  ? TurboModuleRegistry.getEnforcing<Spec>('SystemColors') // New Arch
  : NativeModules.SystemColors;                             // Old Arch

export default SystemColors as Spec;
