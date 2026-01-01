
import type {
  HybridView,
  HybridViewMethods,
  HybridViewProps,
} from 'react-native-nitro-modules';

export interface ELUI_TESTProps extends HybridViewProps {
  color: string;
}
export interface ELUI_TESTMethods extends HybridViewMethods { }

export type ELUI_TEST = HybridView<ELUI_TESTProps, ELUI_TESTMethods>;
