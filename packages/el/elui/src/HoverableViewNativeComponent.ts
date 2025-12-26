import type { ViewProps } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

interface NativeProps extends ViewProps {
  onHoverIn?: DirectEventHandler<{}>;
  onHoverOut?: DirectEventHandler<{}>;
}

export default codegenNativeComponent<NativeProps>('HoverableView');
