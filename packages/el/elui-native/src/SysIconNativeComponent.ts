import {type ViewProps } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

interface NativeProps extends ViewProps {
  symbolName?: string;
}

export default codegenNativeComponent<NativeProps>('SysIcon');
