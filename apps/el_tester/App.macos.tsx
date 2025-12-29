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

import { multiply, FbrViewExample, SysIcon, HoverableView, ResizableSeparator, SystemColors } from 'elui';

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

//console.log(NitrotestHybridObject);
//const result = NitrotestHybridObject.multiply(2, 3);
const notes = [
  { id: '1', title: 'Note 1', body: 'Note 1 body' },
  { id: '2', title: 'Note 2', body: 'Note 2 body' },
  // ...more notes
];
export default function App() {
  const initWith = 245;
  const minWith = 155;
  const maxWith = 600;
  const [leftWidth, setLeftWidth] = useState(initWith); // Initial width
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const savedWidthRef = useRef(initWith); // Save width when hiding

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      // Hide: save current width and set to 0
      savedWidthRef.current = leftWidth;
      setLeftWidth(0);
      setIsSidebarVisible(false);
    } else {
      // Show: restore saved width
      setLeftWidth(savedWidthRef.current);
      setIsSidebarVisible(true);
    }
  };

  // Keep the ref in sync with the state
  React.useEffect(() => {
    if (isSidebarVisible && leftWidth > 0) {
      savedWidthRef.current = leftWidth; // Save non-zero widths
    }
  }, [leftWidth, isSidebarVisible]);

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
      <View style={styles.toolbar}>
        <View style={[styles.toolbarLeft, { width: isSidebarVisible ? leftWidth : savedWidthRef.current }, isSidebarVisible ? {} : { maxWidth: 155 }]} >
          {isSidebarVisible && (
            <View style={styles.toolbarFixed} >
              <Button iconOnly={true} shape={'circular'} appearance={'subtle'} style={styles.vmargin} >
                <SysIcon symbolName="plus.circle.fill" style={styles.box} />
              </Button>
              {leftWidth > minWith && (
                <Button iconOnly={true} shape={'circular'} appearance={'subtle'} style={styles.vmargin} >
                  <SysIcon symbolName="tray" style={styles.box} />
                </Button>
              )}
              {leftWidth > 218 && (
                <Button iconOnly={true} shape={'circular'} appearance={'subtle'} style={styles.vmargin} >
                  <SysIcon symbolName="smallcircle.fill.circle" style={styles.box} />
                </Button>
              )}
            </View>
          )}
          <Button iconOnly={true} shape={'circular'} appearance={'subtle'} style={styles.vmargin}
                  onClick={toggleSidebar} >
            <SysIcon symbolName="sidebar.left" style={styles.box} />
          </Button>
        </View>
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
      <View style={styles.content}>
        {/* Sidebar */}
        <View style={[styles.sidebar, { width: leftWidth, backgroundColor: sidebarBgColor }]}>

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
        {/* Separator
        //https://reactnative.dev/blog/2022/12/13/pointer-events-in-react-native
         onPointerEnter={() => { setIsSeparatorHovered(true); console.log('Mouse enter'); }}
         onPointerLeave={() => { setIsSeparatorHovered(false); console.log('Mouse leave'); }}
         onPointerOver={(event) => { setIsSeparatorHovered(true); console.log('Mouse enter'); console.log(
             'Over   box offset: ',
             event.nativeEvent.offsetX,
             event.nativeEvent.offsetY,
           );}}
         */}
        <ResizableSeparator
          leftPaneWidth={leftWidth}
          minLeftPaneWidth={minWith}
          maxLeftPaneWidth={maxWith}
          onResize={setLeftWidth}
          backgroundColor={sidebarBgColor}
          hidden={!isSidebarVisible}
        />
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
  toolbarLeft: { height: 35, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 60 },
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
  content: { flex: 1, flexDirection: 'row' },
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
