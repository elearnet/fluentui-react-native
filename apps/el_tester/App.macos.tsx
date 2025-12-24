import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
//import { ELUIView, NitrotestHybridObject } from 'el-ui';
import { ButtonV1 as Button } from '@elui-react-native/button';
import { TabList, Tab } from '@elui-react-native/tablist';
import { ThemeProvider, ThemeReference } from '@elui-react-native/theme';
import { createAppleTheme } from '@elui-react-native/apple-theme';

import { multiply, FbrViewExample,SysIcon,InvertedCorner } from 'elui';

// Create theme with custom Tab tokens to hide indicator (Chrome-style tabs)
const baseTheme = createAppleTheme();
const customTheme = new ThemeReference(baseTheme, {
  components: {
    Tab:{
      indicatorThickness:0,
      // Note: Don't set borderRadius here - it overrides inline corner styles
      small:{
        indicatorMargin: 0,
        iconSize:11,
        stackMarginHorizontal:8,
        stackMarginVertical:0,
      },
      medium:{
        indicatorMargin: 0,
        iconSize:11,
        stackMarginVertical:0,
      },
      large:{
        indicatorMargin: 0,
        iconSize:11,
        stackMarginVertical:0,
      },
      // Selected state - this backgroundColor is used by inverted corners
      selected:{
        backgroundColor: 'grey', // Match your styles.detail.backgroundColor
      },
    }
  },
});


const result = multiply(3,8);


//console.log(NitrotestHybridObject);
//const result = NitrotestHybridObject.multiply(2, 3);
const notes = [
  { id: '1', title: 'Note 1', body: 'Note 1 body' },
  { id: '2', title: 'Note 2', body: 'Note 2 body' },
  // ...more notes
];

// Chrome-style inverted corners - using nested Views since borderColor doesn't work on macOS
// Outer View: has the tab's background color
// Inner View: has transparent/toolbar background to "cut out" the curve
const CORNER_SIZE = 8;

interface InvertedCornersProps {
  selectedTabIndex: number;
  tabBackgroundColor: string;
  selectedTabWidth: number;
  tabWidth: number;
}

const InvertedCorners: React.FC<InvertedCornersProps> = ({
                                                           selectedTabIndex,
                                                           tabBackgroundColor,
                                                           selectedTabWidth,
                                                           tabWidth,
                                                         }) => {
  // Calculate left position: all tabs before selected have tabWidth, then the selected tab starts
  const leftPosition = selectedTabIndex * tabWidth;

  return (
    <>
      {/* Left inverted corner */}
      <InvertedCorner
        cornerColor={tabBackgroundColor}
        cornerPosition="left"
        cornerRadius={CORNER_SIZE}
        style={{ position: 'absolute',bottom: 0,left: leftPosition - CORNER_SIZE,width: CORNER_SIZE, height: CORNER_SIZE,zIndex: 10, }}
      />
      {/* Right inverted corner */}
      <InvertedCorner
        cornerColor={tabBackgroundColor}
        cornerPosition="right"
        cornerRadius={CORNER_SIZE}
        style={{ position: 'absolute',bottom: 0,left: leftPosition + selectedTabWidth,width: CORNER_SIZE, height: CORNER_SIZE,zIndex: 10, }}
      />
    </>
  );
};


export default function App() {
  const initWith = 245;
  const minWith = 155;
  const maxWith = 600;
  const [leftWidth, setLeftWidth] = useState(initWith); // Initial width
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSeparatorHovered, setIsSeparatorHovered] = useState(false);
  const leftWidthRef = useRef(leftWidth);
  const initialWidthRef = useRef(initWith);
  const savedWidthRef = useRef(initWith); // Save width when hiding

  // Keep the ref in sync with the state
  React.useEffect(() => {
    leftWidthRef.current = leftWidth;
    if (isSidebarVisible && leftWidth > 0) {
      savedWidthRef.current = leftWidth; // Save non-zero widths
    }
  }, [leftWidth, isSidebarVisible]);

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

  const panResponder = React.useMemo(() =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => {
          setIsSeparatorHovered(true);
          return true;
        },
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          initialWidthRef.current = leftWidthRef.current;
          setIsSeparatorHovered(true);
        },
        onPanResponderMove: (e, gestureState) => {
          setLeftWidth(
            Math.max(minWith, Math.min(maxWith, initialWidthRef.current + gestureState.dx)),
          );
        },
        onPanResponderRelease: () => {
          setIsSeparatorHovered(false);
        },
        onPanResponderTerminate: () => {
          setIsSeparatorHovered(false);
        },
      }),
    [minWith, maxWith]
  );

  const [selectedKey, setSelectedKey] = React.useState('tab1');
  const [selectedTabWith, setSelectedTabWith] = React.useState(200);
  const [tabWith, setabWith] = React.useState(100);
  const onTabSelect = React.useCallback((key: string) => {
    setSelectedKey(key);
  }, []);

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
            <TabList defaultSelectedKey="tab1" onTabSelect={onTabSelect} selectedKey={selectedKey} size="small" appearance="subtle">
              <Tab tabKey="tab1" style={[styles.tab, { backgroundColor: selectedKey === 'tab1' ? styles.detail.backgroundColor : styles.tab.backgroundColor , width: selectedKey === 'tab1'? selectedTabWith:tabWith}]}>
                Tab 1
              </Tab>
              <Tab tabKey="tab2" style={[styles.tab, { backgroundColor: selectedKey === 'tab2' ? styles.detail.backgroundColor : styles.tab.backgroundColor , width: selectedKey === 'tab2'? selectedTabWith:tabWith}]}>
                Tab 2
              </Tab>
              <Tab tabKey="tab3" style={[styles.tab, { backgroundColor: selectedKey === 'tab3' ? styles.detail.backgroundColor : styles.tab.backgroundColor , width: selectedKey === 'tab3'? selectedTabWith:tabWith}]}>
                Tab3 <SysIcon symbolName="sidebar.left" style={{width:20,height:20}} ></SysIcon>
              </Tab>
            </TabList>
            {/* Inverted corners for Chrome-style tabs */}
            <InvertedCorners
              selectedTabIndex={selectedKey === 'tab1' ? 0 : selectedKey === 'tab2' ? 1 : 2}
              tabBackgroundColor={styles.detail.backgroundColor as string}
              selectedTabWidth={selectedTabWith}
              tabWidth={tabWith}
            />
          </View>
        </View>
      </View>
      <View style={styles.content}>
        {/* Sidebar */}
        <View style={[styles.sidebar, { width: leftWidth }]}>

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
        <View
          style={[styles.separator, { backgroundColor: isSeparatorHovered ? 'transparent':styles.sidebar.backgroundColor, width: isSeparatorHovered ? 4 : 1 }]}
          {...panResponder.panHandlers}
          //for resizing cursor
          //options: col-resize, row-resize, ew-resize, ns-resize
          // @ts-ignore
          cursor="ew-resize"
        />
        {/* Detail Pane */}
        <View style={styles.detail}>
          <Text>{result}</Text>
          <Text>{leftWidth}</Text>
          <Text>{isSeparatorHovered ? 'green' : 'red'}</Text>
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
  toolbarRight: { flex: 1, height: 35,  flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10,paddingTop:0 },
  tab:{
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 0, // No rounding at bottom (inverted corners handle this)
    borderBottomRightRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  content: { flex: 1, flexDirection: 'row' },
  sidebar: { backgroundColor: '#ede', paddingTop: 0, height: '100%', },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: 'transparent',
    //backgroundColor: 'red',
    // @ts-ignore
    //cursor: 'col-resize', // for resizing cursor
    zIndex: 1,
  },
  noteTitle: { padding: 10 },
  detail: { flex: 1, paddingTop: 0, backgroundColor: 'grey' },
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
