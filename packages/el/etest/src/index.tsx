export { default as CompatibleView } from './CompatibleViewNativeComponent';
// export { default as RCTFocusZone } from './FocusZoneNativeComponent'
import { getHostComponent } from 'react-native-nitro-modules';
const CompatibleNitroViewConfig = require('../nitrogen/generated/shared/json/CompatibleNitroViewConfig.json');
import type { CompatibleNitroViewMethods, CompatibleNitroViewProps } from './CompatibleNitroView.nitro';

export const CompatibleNitroView = getHostComponent<CompatibleNitroViewProps,CompatibleNitroViewMethods>(
  'CompatibleNitroView',
  () => CompatibleNitroViewConfig
);

/*
const NitroCalloutConfig = require('../nitrogen/generated/shared/json/NitroCalloutConfig.json');
import type {NitroCalloutProps, NitroCalloutMethods} from './NitroCallout.nitro';

export const NitroCallout = getHostComponent<NitroCalloutProps,NitroCalloutMethods>(
  'NitroCallout',
  () => NitroCalloutConfig
);

 */

export { TestNitroCallout } from "./TestNitroCallout"

/*
const [counter, setCounter] = useState(0);
const counterRef = React.useRef<CompatibleNitroView | null>(null);
<TouchableOpacity
            onPress={():void=>{
              counterRef.current?.reset();
            }}
            style={{width:60,height:60}}
          >
            <CompatibleNitroView color="#a53f56"
                                 onTick={callback((count:number) => {
                                setCounter(count);
                            })}
                            startFrom={5}
                            style={{width:60,height:60}}
                            hybridRef={{
                              f: (ref:any) => {
                                counterRef.current = ref
                              },
                            }}
            >
            </CompatibleNitroView>
          </TouchableOpacity>
*/

/*
const [counter, setCounter] = useState(0);
const viewRef = React.useRef<any>(null);
 <TouchableOpacity
          onPress={():void=>{
            if (viewRef.current) {
                const tag = findNodeHandle(viewRef.current);
                if (tag) {
                    UIManager.dispatchViewManagerCommand(tag, 'reset', []);
                }
            }
          }}
          style={{width:60,height:60}}
        >
          <CompatibleNitroView color="#a53f06"
                               ref={viewRef}
                               onTick={callback((e: any) => {
                                 const count = typeof e === 'number' ? e : e.nativeEvent.count;
                                 setCounter(count);
                               })}
                               startFrom={5}
                               style={{width:60,height:60}}
          >
          </CompatibleNitroView>
        </TouchableOpacity>
*/
