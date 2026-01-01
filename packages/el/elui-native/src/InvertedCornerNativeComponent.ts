import type { ViewProps } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
interface NativeProps extends ViewProps {
  /**
   * Fill color for the inverted corner (should match the selected tab's background)
   */
  cornerColor?: string;
  /**
   * Corner position: 'left' or 'right'
   */
  cornerPosition?: string;
  /**
   * Corner radius size (default: 6)
   */
  cornerRadius?: Int32;
}
export default codegenNativeComponent<NativeProps>('InvertedCorner');