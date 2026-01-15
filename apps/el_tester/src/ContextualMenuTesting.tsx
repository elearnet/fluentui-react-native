/**
 * ContextualMenu Test for el_tester
 * Testing ContextualMenu component with FocusZone in Fabric
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import { ContextualMenu, ContextualMenuItem, Submenu, SubmenuItem } from '@elui-react-native/contextual-menu';
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
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
});

// ============================================================================
// Test Sections
// ============================================================================

// 1. Basic ContextualMenu
const BasicContextualMenuTest = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const anchorRef = React.useRef<View>(null);

  return (
    <View style={styles.section} nativeID="section-basic-menu">
      <Text style={styles.sectionTitle}>1. Basic ContextualMenu</Text>
      <Text style={styles.label}>Click button to open menu, use arrow keys to navigate</Text>

      <View ref={anchorRef} collapsable={false}>
        <Button
          onClick={() => setShowMenu(!showMenu)}
          nativeID="menu-trigger-btn"
        >
          Open Menu
        </Button>
      </View>

      {showMenu && (
        <ContextualMenu
          target={anchorRef as any}
          onDismiss={() => setShowMenu(false)}
          setShowMenu={setShowMenu}
          shouldFocusOnMount={true}
          nativeID="basic-context-menu"
        >
          <ContextualMenuItem
            text="Option 1"
            itemKey="1"
            onClick={() => console.log('Option 1 clicked')}
          />
          <ContextualMenuItem
            text="Option 2"
            itemKey="2"
            onClick={() => console.log('Option 2 clicked')}
          />
          <ContextualMenuItem
            text="Option 3"
            itemKey="3"
            onClick={() => console.log('Option 3 clicked')}
          />
          <ContextualMenuItem
            text="Option 4"
            itemKey="4"
            disabled
            onClick={() => console.log('Option 4 clicked')}
          />
        </ContextualMenu>
      )}
    </View>
  );
};

// 2. ContextualMenu with Submenu
const SubmenuTest = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const anchorRef = React.useRef<View>(null);

  return (
    <View style={styles.section} nativeID="section-submenu">
      <Text style={styles.sectionTitle}>2. ContextualMenu with Submenu</Text>
      <Text style={styles.label}>Navigate to "More Options" with arrow keys</Text>

      <View ref={anchorRef} collapsable={false}>
        <Button
          onClick={() => setShowMenu(!showMenu)}
          nativeID="submenu-trigger-btn"
        >
          Open Menu with Submenu
        </Button>
      </View>

      {showMenu && (
        <ContextualMenu
          target={anchorRef as any}
          onDismiss={() => setShowMenu(false)}
          setShowMenu={setShowMenu}
          shouldFocusOnMount={true}
          nativeID="submenu-context-menu"
        >
          <ContextualMenuItem
            text="Action 1"
            itemKey="action1"
          />
          <SubmenuItem
            text="More Options"
            itemKey="submenu"
          >
            <Submenu>
              <ContextualMenuItem text="Sub Option A" itemKey="subA" />
              <ContextualMenuItem text="Sub Option B" itemKey="subB" />
              <ContextualMenuItem text="Sub Option C" itemKey="subC" />
            </Submenu>
          </SubmenuItem>
          <ContextualMenuItem
            text="Action 2"
            itemKey="action2"
          />
        </ContextualMenu>
      )}
    </View>
  );
};

// 3. Multiple Menu Buttons
const MultipleMenusTest = () => {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const anchorRef1 = React.useRef<View>(null);
  const anchorRef2 = React.useRef<View>(null);

  return (
    <View style={styles.section} nativeID="section-multiple-menus">
      <Text style={styles.sectionTitle}>3. Multiple Menu Triggers</Text>
      <Text style={styles.label}>Test focus navigation between different menus</Text>

      <View style={styles.row}>
        <View ref={anchorRef1} collapsable={false}>
          <Button
            onClick={() => setActiveMenu(activeMenu === 'menu1' ? null : 'menu1')}
            nativeID="menu1-trigger-btn"
          >
            Menu 1
          </Button>
        </View>

        <View ref={anchorRef2} collapsable={false}>
          <Button
            onClick={() => setActiveMenu(activeMenu === 'menu2' ? null : 'menu2')}
            nativeID="menu2-trigger-btn"
          >
            Menu 2
          </Button>
        </View>
      </View>

      {activeMenu === 'menu1' && (
        <ContextualMenu
          target={anchorRef1 as any}
          onDismiss={() => setActiveMenu(null)}
          setShowMenu={() => setActiveMenu(null)}
          shouldFocusOnMount={true}
          nativeID="menu1-context-menu"
        >
          <ContextualMenuItem text="Menu 1 - Item A" itemKey="m1a" />
          <ContextualMenuItem text="Menu 1 - Item B" itemKey="m1b" />
          <ContextualMenuItem text="Menu 1 - Item C" itemKey="m1c" />
        </ContextualMenu>
      )}

      {activeMenu === 'menu2' && (
        <ContextualMenu
          target={anchorRef2 as any}
          onDismiss={() => setActiveMenu(null)}
          setShowMenu={() => setActiveMenu(null)}
          shouldFocusOnMount={true}
          nativeID="menu2-context-menu"
        >
          <ContextualMenuItem text="Menu 2 - Item X" itemKey="m2x" />
          <ContextualMenuItem text="Menu 2 - Item Y" itemKey="m2y" />
          <ContextualMenuItem text="Menu 2 - Item Z" itemKey="m2z" />
        </ContextualMenu>
      )}
    </View>
  );
};

// ============================================================================
// Main App
// ============================================================================

function ContextualMenuTesting(): React.JSX.Element {
  return (
    <ScrollView style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        ContextualMenu Test Cases
      </Text>

      <BasicContextualMenuTest />
      <SubmenuTest />
      <MultipleMenusTest />

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

export default ContextualMenuTesting;
