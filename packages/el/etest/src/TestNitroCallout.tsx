
import * as React from 'react';
import { View, Text, Button, StyleSheet, findNodeHandle, UIManager } from 'react-native';
import { getHostComponent,callback } from 'react-native-nitro-modules';
import type { MacOSCalloutProps, MacOSCalloutMethods } from './MacOSCallout.nitro';

const FRNCalloutConfig = require('../nitrogen/generated/shared/json/FRNCalloutConfig.json');

const FRNCalloutView = getHostComponent<MacOSCalloutProps, MacOSCalloutMethods>('FRNCallout',()=>FRNCalloutConfig);

export const TestNitroCallout = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [anchorRect, setAnchorRect] = React.useState({ screenX: 0, screenY: 0, width: 0, height: 0 });

  const anchorRef = React.useRef<View>(null);
  const calloutOldArchRef = React.useRef<any>(null);
  const calloutNewArchRef = React.useRef<MacOSCalloutMethods>(null);

  const onScanAnchor = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      console.log('Anchor measured:', x, y, width, height);
      setAnchorRect({ screenX: x, screenY: y, width, height });
      setIsVisible(true);
    });
  };
  /*
  onRestoreFocus?: (target: number, containsFocus: boolean) => void;
  onDismiss?: (target: number) => void;
  onShow?: (target: number) => void;
   */

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nitro Callout Test</Text>

      {/* Anchor Element */}
      <View ref={anchorRef} style={styles.anchorBox}>
        <Text>I am the Anchor</Text>
      </View>

      <Button title="Open Callout" onPress={onScanAnchor} />

      {isVisible && (
        <FRNCalloutView
          ref={calloutOldArchRef}
          hybridRef={{
            f: (ref:any) => {
              calloutNewArchRef.current = ref
            },
          }}
          style={styles.callout} // Wrapper style
          anchorRect={anchorRect}
          directionalHint="bottomCenter"
          setInitialFocus={true}
          onShow={callback(( target: number) => {
            console.log('Callout onShow triggered',target);
          })}
          onDismiss={callback(() => {
            console.log('Callout onDismiss triggered');
            setIsVisible(false);
          })}
        >
          {/* Callout Content */}
          <View style={styles.calloutContent}>
            <Text style={styles.calloutText}>Hello from Nitro Callout!</Text>
            <Button
              title="Focus Window"
              onPress={() => {
                 console.log('Calling focusWindow()');
                if (calloutOldArchRef.current) {
                  const tag = findNodeHandle(calloutOldArchRef.current);
                  if (tag) {
                    UIManager.dispatchViewManagerCommand(tag, 'focusWindow', []);
                  }
                } else if(calloutNewArchRef.current){
                  calloutNewArchRef.current?.focusWindow();
                }
              }}
            />
            <Button
              title="Blur Window"
              onPress={() => {
                 console.log('Calling blurWindow()');
                if (calloutOldArchRef.current) {
                  const tag = findNodeHandle(calloutOldArchRef.current);
                  if (tag) {
                    UIManager.dispatchViewManagerCommand(tag, 'blurWindow', []);
                  }
                } else if(calloutNewArchRef.current){
                  calloutNewArchRef.current?.blurWindow();
                }
              }}
            />
            <Button title="Close" onPress={() => setIsVisible(false)} />
          </View>
        </FRNCalloutView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
  anchorBox: {
    width: 150,
    height: 60,
    backgroundColor: '#0078d4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 20,
  },
  callout: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  calloutContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    gap: 10,
  },
  calloutText: {
    marginBottom: 10,
    fontWeight: 'bold',
  }
});
