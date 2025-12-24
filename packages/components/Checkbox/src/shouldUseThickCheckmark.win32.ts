import type { Theme } from '@elui-react-native/framework';
import { isHighContrast } from '@elui-react-native/theming-utils';

export function shouldUseThickCheckmark(theme: Theme): boolean {
  if (isHighContrast(theme)) {
    return true;
  }

  return false;
}
