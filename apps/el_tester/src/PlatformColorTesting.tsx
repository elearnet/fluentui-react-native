import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  PlatformColor,
} from 'react-native';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'grey',
    borderRadius: 8,
    padding: 16,
  },
  textColorText: {
    // This should crash RCTParagraphComponentView / ParagraphProps
    //color: PlatformColor('labelColor'),
    color: PlatformColor('labelColor'),
    fontSize: 16,
    marginBottom: 8,
  },
  backgroundView: {
    width: 100,
    height: 50,
    // This should crash RCTViewComponentView / ViewProps
    //backgroundColor: PlatformColor('windowBackgroundColor'),
    backgroundColor: PlatformColor('systemGreen'),
    marginBottom: 8,
  },
});

function PlatformColorTesting(): React.JSX.Element {
  console.log('Rendering PlatformColorTesting with PlatformColor tokens...',styles.textColorText,styles.backgroundView);

  return (
    <View style={styles.container}>
      <Text style={styles.section}>
        PlatformColor Crash Reproduction
      </Text>
      <View style={styles.section}>
       <Text>Test 1: Text Color (PlatformColor('labelColor'))</Text>
       <Text style={styles.textColorText}>
         This text uses PlatformColor('labelColor'). If you see this, RCTText survived.
       </Text>
      </View>
      <View style={styles.section}>
        <Text>Test 2: View Background (PlatformColor('windowBackgroundColor'))</Text>
        <View style={styles.backgroundView}><Text style={styles.textColorText}>
          hi
        </Text></View>
      </View>
    </View>
  );
}
/*

* */
export default PlatformColorTesting;
