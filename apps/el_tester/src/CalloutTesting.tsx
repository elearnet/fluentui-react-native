/**
 * FocusZone Test App for el_tester
 * Testing FocusZone component with various configurations
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {TestCallout } from '@elui-react-native/callout';
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
  scrollViewContainer: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
});

// ============================================================================
// Main App
// ============================================================================

function App(): React.JSX.Element {
  const useScrollView = false;

  const content = (
    <>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Callout Test Cases aa
      </Text>
      <TestCallout />
      <View style={{ height: 100 }} />
    </>
  );

  return (
    <ScrollView style={styles.container}>
      {useScrollView ? (
        <ScrollView style={{ flex: 1 }}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </ScrollView>
  );
}

export default App;

/*
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {TestCallout } from '@elui-react-native/callout';

export default function App() {

  // @ts-ignore
  const rootElement = (
    <View style={styles.container} collapsable={false}>
      <View style={styles.toolbar}>
      </View>
      <View style={styles.content}>
        <TestCallout />
      </View>
    </View>
  );
  //console.log(rootElement);
  return  rootElement;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  toolbar: { height: 35, backgroundColor: 'transparent', flexDirection: 'row' },
  content: {
    flex: 1, flexDirection: 'row',backgroundColor:'#aaaaaa',
  },
});
*/
