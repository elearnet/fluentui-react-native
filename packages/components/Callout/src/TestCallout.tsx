import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Callout } from './Callout';

export const TestCallout = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [anchorRect, setAnchorRect] = React.useState({ screenX: 0, screenY: 0, width: 0, height: 0 });
  const anchorRef = React.useRef<View>(null);

  const onShowCallout = () => {
    if (anchorRef.current) {
      anchorRef.current.measureInWindow((x, y, width, height) => {
        console.log('[TestCallout] Measured:', x, y, width, height);
        setAnchorRect({ screenX: x, screenY: y, width, height });
        setIsVisible(true);
      });
    }
  };

  const onDismiss = () => {
    console.log('[TestCallout] onDismiss');
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Callout Test</Text>

      <View
        ref={anchorRef}
        style={styles.anchorContainer}
      >
        <TouchableOpacity onPress={onShowCallout} style={styles.button}>
          <Text style={styles.buttonText}>Show Callout</Text>
        </TouchableOpacity>
      </View>

      {isVisible && (
        <Callout
          anchorRect={anchorRect}
          onDismiss={onDismiss}
          style={styles.callout}
          // Visual props verification
          backgroundColor="white"
          borderColor="blue"
          borderWidth={2}
          borderRadius={8}
        >
          <View style={styles.content}>
            <Text style={styles.contentText}>Hello from Fabric Callout!</Text>
            <TouchableOpacity onPress={()=>{console.log("clos button triggered"); onDismiss()}} style={styles.closeButton}>
              <Text style={{color: 'white'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </Callout>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'flex-start', // Align to left to test positioning
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  anchorContainer: {
    marginTop: 50,
    marginLeft: 50,
  },
  button: {
    backgroundColor: '#0078d4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
  },
  callout: {
    width: 200,
    height: 100,
    // Note: absolute position is handled natively by the window,
    // but strict layout size comes from these styles.
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    color: 'black',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 4,
  }
});
