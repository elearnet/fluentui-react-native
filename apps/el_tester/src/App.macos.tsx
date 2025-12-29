import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
//import { PlatformColor,DynamicColorMacOS } from 'react-native-macos';
//import { ELUIView, NitrotestHybridObject } from 'el-ui';
import { ButtonV1 as Button } from '@elui-react-native/button';
import { TabList, Tab } from '@elui-react-native/tablist';
import { ThemeProvider, ThemeReference } from '@elui-react-native/theme';
import { fontStyles, useFluentTheme } from '@elui-react-native/framework';
import { createAppleTheme } from '@elui-react-native/apple-theme';

import { multiply, FbrViewExample, SysIcon, HoverableView, PaneWithSeparator, SystemColors ,openNewWindow} from 'elui';
//import type { PaneState } from 'elui';

// CloseButton component with native hover support via HoverableView
const CloseButton = ({ onPress }: { onPress: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <HoverableView
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.tabCloseButton,
          isHovered && styles.tabCloseButtonHovered,
        ]}
      >
        <SysIcon symbolName="xmark" style={styles.tabCloseIcon} />
      </TouchableOpacity>
    </HoverableView>
  );
};

// HoverableTabContent component - shows hover background on tab content
interface HoverableTabContentProps {
  icon: string;
  title: string;
  isSelected:boolean;
  onClose: () => void;
}
const HoverableTabContent = ({ icon, title, isSelected, onClose }: HoverableTabContentProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useFluentTheme();

  // Get font styles from theme (similar to Tab.styling.ts)
  const textStyle = React.useMemo(() => ({
    ...styles.tabText,
    color: theme.colors.neutralForeground1,
    ...fontStyles.from({ fontSize: 12 }, theme),
  }), [theme]);

  return (
    <HoverableView
      onHoverIn={() => setIsHovered(true && !isSelected)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.tabContent,
        isHovered && styles.tabContentHovered,
      ]}
    >
      <SysIcon symbolName={icon} style={styles.tabIcon} />
      <Text style={textStyle}>{title}</Text>
      <CloseButton onPress={onClose} />
    </HoverableView>
  );
};

// Notes data (moved before SideBar so it can be used inside)
const notes = [
  { id: '1', title: 'Note 1', body: 'Note 1 body' },
  { id: '2', title: 'Note 2', body: 'Note 2 body' },
  // ...more notes
];
// SideBar component props
interface SideBarProps {
  initWidth: number;
  minWidth: number;
  maxWidth: number;
  onHidden: (isHidden: boolean) => void;
  sidebarBgColor: string;
}
const SideBar = React.memo(({ initWidth, minWidth, maxWidth, sidebarBgColor,onHidden }: SideBarProps) => {
  // Toggle functionality managed here (since it needs UI state)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const savedWidthRef = useRef(initWidth);

  const [buttonWidth, setButtonWidth] = useState(40); // default fallback

  console.log('SideBar renders');

  return (
    <PaneWithSeparator initWidth={initWidth} minWidth={minWidth} maxWidth={maxWidth} separatorBgColor={'transparent'}>
      {({ paneWidth, setPaneWidth }) => {
        const toggleSidebar = () => {
          if (isSidebarVisible) {
            savedWidthRef.current = paneWidth;
            setPaneWidth(0);
            setIsSidebarVisible(false);
            onHidden(true);
          } else {
            setPaneWidth(savedWidthRef.current);
            setIsSidebarVisible(true);
            onHidden(false);
          }
        };

        // Keep savedWidthRef in sync
        if (isSidebarVisible && paneWidth > 0) {
          savedWidthRef.current = paneWidth;
        }

        return (
          <>
            <View style={[{ height: 35, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 60 }]}>
              {isSidebarVisible && (
                <View style={[styles.toolbarFixed,{overflow:'hidden'}]}>
                  <Button iconOnly={true} shape={'circular'} appearance={'subtle'} style={styles.vmargin} onClick={() => testOpenWin('testType', 'testId', 'testTitle')}>
                    <SysIcon symbolName="plus.circle.fill" style={styles.box} />
                  </Button>
                  {/* {paneWidth > minWidth && ( */}
                    <Button iconOnly={true} shape={'circular'} appearance={'subtle'} style={styles.vmargin}>
                      <SysIcon symbolName="tray" style={styles.box} />
                    </Button>
                  {/* )}
                  {paneWidth > 218 && ( */}
                    <Button iconOnly={true} shape={'circular'} appearance={'subtle'} style={styles.vmargin}>
                      <SysIcon symbolName="smallcircle.fill.circle" style={styles.box} />
                    </Button>
                  {/* )} */}
                </View>
              )}
              <Button onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setButtonWidth(width);
              }} iconOnly={true} shape={'circular'} appearance={'subtle'} style={isSidebarVisible?styles.vmargin:{ position: 'absolute', left: minWidth - buttonWidth, top: 0, zIndex: 100 }}
                      onClick={toggleSidebar}>
                <SysIcon symbolName="sidebar.left" style={styles.box} />
              </Button>
            </View>
            <View style={[styles.sidebar, { backgroundColor: sidebarBgColor }]}>
              <FlatList
                data={notes}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity>
                    <Text style={styles.noteTitle}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        );
      }}
    </PaneWithSeparator>
  );
});
// Create theme with custom Tab tokens to hide indicator (Chrome-style tabs)
const baseTheme = createAppleTheme();
const customTheme = new ThemeReference(baseTheme, {
  components: {
    Tab:{
      indicatorThickness:0,
      backgroundColor:'red',
      // Note: Don't set borderRadius here - it overrides inline corner styles
      small:{
        indicatorMargin: 0,
        backgroundColor:'red',
        iconSize:11,
        stackMarginHorizontal:0,
        stackMarginVertical:0,
      },
      medium:{
        indicatorMargin: 0,
        iconSize:11,
        stackMarginHorizontal:0,
        stackMarginVertical:0,
      },
      large:{
        indicatorMargin: 0,
        iconSize:11,
        stackMarginHorizontal:0,
        stackMarginVertical:0,
      },
      // Selected state - this backgroundColor is used by inverted corners
      selected:{
        backgroundColor: 'grey', // Match your styles.detail.backgroundColor
      },
    }
  },
});
// customTheme.theme.colors.bodyFrameBackground

const result = multiply(3,55);
const testOpenWin = (type: string, id: string, title: string)=>{
  openNewWindow(type, id, title);
}

//console.log(NitrotestHybridObject);
//const result = NitrotestHybridObject.multiply(2, 3);

export default function App() {
  const sidebarInitWidth = 245;
  const sidebarMinWidth = 155;
  const sidebarMaxWidth = 600;
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const [selectedKey, setSelectedKey] = React.useState('tab1');
  const [selectedTabWith, setSelectedTabWith] = React.useState(200);
  const [tabWith, setabWith] = React.useState(200);
  const onTabSelect = React.useCallback((key: string) => {
    setSelectedKey(key);
  }, []);

  const colorScheme = useColorScheme();

  // Dynamic colors - re-evaluated on each render when colorScheme changes
  const sidebarBgColor = SystemColors.getSystemColor('windowBackgroundColor') || '#ECECEC';
  const detailBgColor = SystemColors.getSystemColor('unemphasizedSelectedContentBackgroundColor') || '#E0E0E0';

  // Debug: Check if re-render happens and what colors are returned
  console.log('colorScheme:', colorScheme, 'sidebar:', sidebarBgColor, 'detail:', detailBgColor);

  // @ts-ignore
  const rootElement = (
    <View style={styles.container} collapsable={false}>
      <SideBar onHidden={setIsSidebarHidden} initWidth={sidebarInitWidth} minWidth={sidebarMinWidth} maxWidth={sidebarMaxWidth} sidebarBgColor={sidebarBgColor} />
      <View style={styles.content}>
        <View style={[styles.toolbar,{marginLeft:isSidebarHidden?sidebarMinWidth:0}]}>
          <View style={[styles.toolbarRight, { overflow: 'visible' }]}>
            <View style={{ position: 'relative', overflow: 'visible', flexDirection: 'row' }}>
              <TabList defaultSelectedKey="tab1" style={styles.tabList} onTabSelect={onTabSelect} selectedKey={selectedKey} size="small" appearance="subtle">
                <Tab
                  tabKey="tab1"
                  showSeparator={selectedKey !== 'tab1' && selectedKey !== 'tab2'}
                showInvertedCorners cornerColor={detailBgColor}
                style={[styles.tab, { backgroundColor: selectedKey === 'tab1' ? detailBgColor : styles.tab.backgroundColor , width: selectedKey === 'tab1'? selectedTabWith:tabWith}]}
              >
                <HoverableTabContent icon="star.fill" title="Tab 1" isSelected={selectedKey === 'tab1'} onClose={() => console.log('Close tab1')} />
              </Tab>
              <Tab
                tabKey="tab2"
                showSeparator={selectedKey !== 'tab2' && selectedKey !== 'tab3'}
                showInvertedCorners cornerColor={detailBgColor}
                style={[styles.tab, { backgroundColor: selectedKey === 'tab2' ? detailBgColor : styles.tab.backgroundColor , width: selectedKey === 'tab2'? selectedTabWith:tabWith}]}
              >
                <HoverableTabContent icon="doc.text" title="Tab 2" isSelected={selectedKey === 'tab2'} onClose={() => console.log('Close tab2')} />
              </Tab>
              <Tab
                tabKey="tab3"
                showSeparator={selectedKey !== 'tab3' && selectedKey !== 'tab4'}
                showInvertedCorners cornerColor={detailBgColor}
                style={[styles.tab, { backgroundColor: selectedKey === 'tab3' ? detailBgColor : styles.tab.backgroundColor , width: selectedKey === 'tab3'? selectedTabWith:tabWith}]}
              >
                <HoverableTabContent icon="folder" title="Tab 3" isSelected={selectedKey === 'tab3'} onClose={() => console.log('Close tab3')} />
              </Tab>
              <Tab
                tabKey="tab4"
                showInvertedCorners cornerColor={detailBgColor}
                style={[styles.tab, { backgroundColor: selectedKey === 'tab4' ? detailBgColor : styles.tab.backgroundColor , width: selectedKey === 'tab4'? selectedTabWith:tabWith}]}
              >
                <HoverableTabContent icon="gear" title="Tab 4" isSelected={selectedKey === 'tab4'} onClose={() => console.log('Close tab4')} />
              </Tab>
            </TabList>
          </View>
          </View>
        </View>
        {/* Detail Pane */}
        <View style={[styles.detail, { backgroundColor: detailBgColor }]}>
          <Text>{result}</Text>
          <Text>{selectedKey}</Text>
          <FbrViewExample style={styles.box} color="#452109"></FbrViewExample>
          <SysIcon symbolName="sidebar.left" style={styles.box} ></SysIcon>
          <View style={{
            position: 'absolute',
            bottom: 100,
            left: 100,
            width: 60,
            height: 60,
            backgroundColor: 'red',

            zIndex: 10,
          }} >
            <View style={{
              width: 60,
              height: 60,
              backgroundColor: 'blue',
              borderBottomRightRadius: 60,
            }} />
          </View>
          {/* Right inverted corner */}
          <View style={{
            position: 'absolute',
            bottom: 100,
            left: 200,
            width: 60,
            height: 60,
            backgroundColor: 'green',
            borderBottomLeftRadius: 60,
            borderLeftWidth: 60,
            borderBottomWidth: 60,
            borderColor: 'red',
            zIndex: 10,
          }} />
        </View>
      </View>
    </View>
  );
  //console.log(rootElement);
  return (
    <ThemeProvider theme={customTheme}>
      {rootElement}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // SideBar and content side-by-side

    // borderWidth: 2,
    // // borderTopColor: 'red', //not showing color,don't know why. to be fixed.
    // // borderBottomColor: 'red',
    // // borderLeftColor: 'red',
    // // borderRightColor: 'red',
    // //This is a known limitation/bug in React Native macOS
    // // Use a wrapper View to simulate a border
    // borderColor: 'red', //not showing color,don't know why. to be fixed.
    // borderStyle: 'solid',
    backgroundColor: 'transparent',
  },
  toolbar: { height: 35, backgroundColor: 'transparent', flexDirection: 'row' },
  //toolbarLeft: { height: 35, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 60 },
  toolbarFixed: { position: 'absolute', left: 80, height: '100%', flexDirection: 'row', alignItems: 'center' },
  toolbarRight: { flex: 1, height: 35,  flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10,paddingTop:8 },
  tabList:{
    flex: 1, height: 27,
  },
  tab:{
    height: 27,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 0, // No rounding at bottom (inverted corners handle this)
    borderBottomRightRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  tabContent: {
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    borderRadius: 6,
    paddingHorizontal: 3,
  },
  tabContentHovered: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  tabText: {
    flex: 1,
    fontSize: 12,
  },
  tabCloseButton: {
    marginLeft: 6,
    padding: 2,
    borderRadius: 4,
  },
  tabCloseButtonHovered: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabCloseIcon: {
    width: 12,
    height: 12,
  },
  content: { flex: 1, flexDirection: 'column' }, // Column: toolbar on top, detail below
  sidebar: { paddingTop: 0, height: '100%' },
  noteTitle: { padding: 10 },
  detail: { flex: 1, paddingTop: 0 },
  box: {
    width: 30,
    height: 30
  },
  vmargin: {
    marginVertical: 0
  },
  vmargin2: {
    marginLeft: -32,
    marginVertical: 0
  },

});
