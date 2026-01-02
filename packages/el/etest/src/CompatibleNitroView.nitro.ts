
import type {
  HybridView,
  HybridViewMethods,
  HybridViewProps,
} from 'react-native-nitro-modules';

export interface CompatibleNitroViewProps extends HybridViewProps {
  color: string;
  startFrom?: number;
  onTick?: (count: number) => void;
}
export interface CompatibleNitroViewMethods extends HybridViewMethods {
  reset(): void;
}

export type CompatibleNitroView = HybridView<CompatibleNitroViewProps, CompatibleNitroViewMethods>;
