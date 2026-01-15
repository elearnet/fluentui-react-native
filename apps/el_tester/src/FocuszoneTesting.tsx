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
  Pressable,
  TextInput,
} from 'react-native';

import { FocusZone } from '@elui/react-native';
import { ButtonV1 as Button } from '@elui-react-native/button';

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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  dashedBorder: {
    borderWidth: 2,
    borderColor: '#0078d4',
    borderStyle: 'dashed',
    padding: 12,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridButton: {
    width: 60,
    height: 40,
    backgroundColor: '#0078d4',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  focusableBox: {
    width: 80,
    height: 40,
    backgroundColor: '#e1e1e1',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  focusableBoxFocused: {
    borderColor: '#0078d4',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    minHeight: 60,
    marginTop: 8,
  },
  scrollViewContainer: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  nestedFocusZone: {
    borderWidth: 2,
    borderColor: '#ff6b6b',
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
  },
  innerFocusZone: {
    borderWidth: 2,
    borderColor: '#4ecdc4',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

// ============================================================================
// Helper Components
// ============================================================================

const GridOfButtons = ({ gridWidth = 3, gridHeight = 3, prefix = 'btn' }: { gridWidth?: number; gridHeight?: number; prefix?: string }) => {
  const buttons = [];
  for (let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      const index = row * gridWidth + col + 1;
      const buttonId = `${prefix}-${index}`;
      buttons.push(
        <Pressable
          key={index}
          style={({ pressed }) => [
            styles.gridButton,
            pressed && { backgroundColor: '#005a9e' },
          ]}
          focusable
          nativeID={buttonId}

           accessibilityActions={[
            { name: 'focus', label: 'Focus' },
            { name: 'blur', label: 'Blur' },
          ]}
          // Handle the events from native
          onAccessibilityAction={(event) => {
            const actionName = event.nativeEvent.actionName;
            if (actionName === 'focus') {
              console.log(`Focused: ${buttonId}`);
              //setFocusedId(buttonId);
            } else if (actionName === 'blur') {
              console.log(`Blurred: ${buttonId}`);
              //setFocusedId(null);
            }
          }}
        >
          <Text style={styles.gridButtonText}>{index}</Text>
        </Pressable>
      );
    }
  }
  return <View style={styles.gridContainer}>{buttons}</View>;
};

const FocusableBox = ({ label, nativeID }: { label: string; nativeID?: string }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.focusableBox,
        pressed && styles.focusableBoxFocused,
      ]}
      focusable
      nativeID={nativeID}
    >
      <Text>{label}</Text>
    </Pressable>
  );
};

// ============================================================================
// Test Sections
// ============================================================================

// 1. Basic FocusZone with Grid
const BasicFocusZoneGrid = () => (
  <View style={styles.section} nativeID="section-basic-grid">
    <Text style={styles.sectionTitle}>1. Basic FocusZone Grid (3x3)</Text>
    <Text style={styles.label}>Arrow keys navigate between buttons</Text>
    <FocusZone focusZoneDirection="bidirectional" nativeID="fz-basic-grid">
      <View style={styles.dashedBorder}>
        <GridOfButtons gridWidth={3} gridHeight={3} prefix="grid" />
      </View>
    </FocusZone>
  </View>
);

// 2. Circular Navigation
const CircularNavigationTest = () => (
  <View style={styles.section} nativeID="section-circular">
    <Text style={styles.sectionTitle}>2. Circular Navigation</Text>
    <Text style={styles.label}>Navigation wraps around at edges</Text>
    <FocusZone isCircularNavigation focusZoneDirection="horizontal" nativeID="fz-circular">
      <View style={styles.dashedBorder}>
        <View style={styles.row}>
          <FocusableBox label="A" nativeID="circular-box-a" />
          <FocusableBox label="B" nativeID="circular-box-b" />
          <FocusableBox label="C" nativeID="circular-box-c" />
          <FocusableBox label="D" nativeID="circular-box-d" />
        </View>
      </View>
    </FocusZone>
  </View>
);

// 3. Directional FocusZone (Vertical only)
const VerticalFocusZone = () => (
  <View style={styles.section} nativeID="section-vertical">
    <Text style={styles.sectionTitle}>3. Vertical Direction Only</Text>
    <Text style={styles.label}>Only Up/Down arrows work</Text>
    <FocusZone focusZoneDirection="vertical" nativeID="fz-vertical">
      <View style={styles.dashedBorder}>
        <Button nativeID="vert-btn-1">Button 1</Button>
        <Button nativeID="vert-btn-2">Button 2</Button>
        <Button nativeID="vert-btn-3">Button 3</Button>
      </View>
    </FocusZone>
  </View>
);

// 4. Directional FocusZone (Horizontal only)
const HorizontalFocusZone = () => (
  <View style={styles.section} nativeID="section-horizontal">
    <Text style={styles.sectionTitle}>4. Horizontal Direction Only</Text>
    <Text style={styles.label}>Only Left/Right arrows work</Text>
    <FocusZone focusZoneDirection="horizontal" nativeID="fz-horizontal">
      <View style={[styles.dashedBorder, styles.row]}>
        <Button nativeID="horiz-btn-a">A</Button>
        <Button nativeID="horiz-btn-b">B</Button>
        <Button nativeID="horiz-btn-c">C</Button>
      </View>
    </FocusZone>
  </View>
);

// 5. Disabled FocusZone
const DisabledFocusZoneTest = () => (
  <View style={styles.section} nativeID="section-disabled">
    <Text style={styles.sectionTitle}>5. Disabled FocusZone</Text>
    <Text style={styles.label}>FocusZone is disabled - no arrow navigation</Text>
    <FocusZone disabled nativeID="fz-disabled">
      <View style={styles.dashedBorder}>
        <View style={styles.row}>
          <FocusableBox label="1" nativeID="disabled-box-1" />
          <FocusableBox label="2" nativeID="disabled-box-2" />
          <FocusableBox label="3" nativeID="disabled-box-3" />
        </View>
      </View>
    </FocusZone>
  </View>
);

// 6. Nested FocusZones
const NestedFocusZoneTest = () => (
  <View style={styles.section} nativeID="section-nested">
    <Text style={styles.sectionTitle}>6. Nested FocusZones</Text>
    <Text style={styles.label}>Outer (red) is Vertical, Inner (teal) is Horizontal</Text>
    <FocusZone focusZoneDirection="vertical" nativeID="fz-outer">
      <View style={styles.nestedFocusZone}>
        <Text style={styles.label}>Outer Zone (Vertical)</Text>
        <FocusZone focusZoneDirection="horizontal" nativeID="fz-inner-1">
          <View style={styles.innerFocusZone}>
            <Text style={styles.label}>Inner Zone 1 (Horizontal)</Text>
            <GridOfButtons gridWidth={3} gridHeight={1} prefix="inner1" />
          </View>
        </FocusZone>
        <FocusZone focusZoneDirection="horizontal" nativeID="fz-inner-2">
          <View style={styles.innerFocusZone}>
            <Text style={styles.label}>Inner Zone 2 (Horizontal)</Text>
            <GridOfButtons gridWidth={3} gridHeight={1} prefix="inner2" />
          </View>
        </FocusZone>
        <Button nativeID="nested-bottom-btn">Bottom Button (in outer zone)</Button>
      </View>
    </FocusZone>
  </View>
);

// 7. FocusZone with TextInput
const FocusZoneWithTextInput = () => (
  <View style={styles.section} nativeID="section-textinput">
    <Text style={styles.sectionTitle}>7. FocusZone with TextInput</Text>
    <Text style={styles.label}>TextInput should be focusable within FocusZone</Text>
    <FocusZone focusZoneDirection="vertical" nativeID="fz-textinput">
      <View style={styles.dashedBorder}>
        <Button nativeID="textinput-btn-above">Button Above</Button>
        <TextInput
          style={styles.textInput}
          placeholder="Type here..."
          multiline
          nativeID="textinput-field"
        />
        <Button nativeID="textinput-btn-below">Button Below</Button>
      </View>
    </FocusZone>
  </View>
);

// 8. Tab Navigation Test
const TabNavigationTest = () => (
  <View style={styles.section} nativeID="section-tab-nav">
    <Text style={styles.sectionTitle}>8. Tab Navigation (NavigateWrap)</Text>
    <Text style={styles.label}>Tab key wraps around within FocusZone</Text>
    <FocusZone tabKeyNavigation="NavigateWrap" nativeID="fz-tab-nav">
      <View style={styles.dashedBorder}>
        <View style={styles.row}>
          <Button nativeID="tab-btn-1">Tab 1</Button>
          <Button nativeID="tab-btn-2">Tab 2</Button>
          <Button nativeID="tab-btn-3">Tab 3</Button>
        </View>
      </View>
    </FocusZone>
  </View>
);

// 9. defaultTabbableElement Test
const DefaultTabbableElementTest = () => {
  const buttonRef = React.useRef(null);
  const nativeIDValue = 'defaultFocusButton';

  return (
    <View style={styles.section} nativeID="section-default-tabbable">
      <Text style={styles.sectionTitle}>9. Default Tabbable Element</Text>
      <Text style={styles.label}>Focus should start on "Start Here" button</Text>
      <FocusZone defaultTabbableElement={nativeIDValue} nativeID="fz-default-tabbable">
        <View style={styles.dashedBorder}>
          <View style={styles.row}>
            <Button nativeID="default-btn-first">First</Button>
            <Button nativeID={nativeIDValue}>Start Here</Button>
            <Button nativeID="default-btn-third">Third</Button>
          </View>
        </View>
      </FocusZone>
    </View>
  );
};

// ============================================================================
// Main App
// ============================================================================

function App(): React.JSX.Element {
  return (
    <ScrollView style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        FocusZone Test Cases
      </Text>

      <BasicFocusZoneGrid />
      <CircularNavigationTest />
      <VerticalFocusZone />
      <HorizontalFocusZone />
      <DisabledFocusZoneTest />
      <NestedFocusZoneTest />
      <FocusZoneWithTextInput />
      <DefaultTabbableElementTest />
      <TabNavigationTest />
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

export default App;
