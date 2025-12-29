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
export { ResizableSeparator } from './ResizableSeparator';
export type { ResizableSeparatorProps } from './ResizableSeparator';
export { PaneWithSeparator } from './PaneWithSeparator';
export type { PaneWithSeparatorProps, PaneState } from './PaneWithSeparator';
export { default as SystemColors } from './NativeSystemColors';

