
import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Callout, { Commands } from './CalloutNativeComponent';
<script src="http://localhost:8097"></script>
export const TestNitroCallout = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [anchorRect, setAnchorRect] = React.useState({ screenX: 0, screenY: 0, width: 0, height: 0 });

  const anchorRef = React.useRef<View>(null);
  const calloutRef = React.useRef<React.ElementRef<typeof Callout>>(null);

  const onMeasureAnchor = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      console.log('Anchor measureInWindow:', x, y, width, height);
      setAnchorRect({ screenX: x, screenY: y, width, height });
      setIsVisible(true);
    });
    // anchorRef.current?.measure((x, y, width, height) => {
    //   console.log('Anchor measure:', x, y, width, height);
    // });

  };

  console.log('Callout Style:', StyleSheet.flatten(styles.callout));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fabric Callout Test</Text>

      {/* Anchor Element */}
      <View ref={anchorRef} style={styles.anchorBox}>
        <Text>I am the Anchor ww</Text>
      </View>

      <Button title="Open Callout" onPress={onMeasureAnchor} />

      {isVisible && (
        <Callout
          ref={calloutRef}
          style={styles.callout}
          anchorRect={anchorRect}
          onDismiss={() => {
              console.log("Callout dismissed");
              setIsVisible(false);
          }}
        >
          <View style={styles.calloutContent}>
            <Text style={styles.calloutText}>Hello from Fabric Callout!</Text>
            <Button
                title="Focus Window"
                onPress={() => {
                    console.log("Focus Window clicked from js side");
                    if (calloutRef.current) {
                        console.log("calling command focusWindow from js side");
                        Commands.focusWindow(calloutRef.current);
                    }
                }}
            />
            <Button title="Close" onPress={() => setIsVisible(false)} />
          </View>
        </Callout>
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
    width: 200,
    height: 300,
    borderRadius: 8,
  },
  calloutContent: {
     flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    //gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calloutText: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'black'
  }
});
