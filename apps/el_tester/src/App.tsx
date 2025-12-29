/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

// //Pane state and render props interface
// interface PaneState {
//   leftWidth: number;
//   isSidebarVisible: boolean;
//   savedWidth: number;
//   minWidth: number;
//   maxWidth: number;
//   toggleSidebar: () => void;
//   setLeftWidth: (width: number) => void;
// }
// interface PaneProps {
//   sidebarBgColor: string;
//   children: (state: PaneState) => React.ReactNode;
// }

// const LeftPane = React.memo(({ sidebarBgColor, children }: PaneProps) => {
//   const initWidth = 245;
//   const minWidth = 155;
//   const maxWidth = 600;
//   const [leftWidth, setLeftWidth] = useState(initWidth);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(true);
//   const savedWidthRef = useRef(initWidth);

//   const toggleSidebar = React.useCallback(() => {
//     if (isSidebarVisible) {
//       savedWidthRef.current = leftWidth;
//       setLeftWidth(0);
//       setIsSidebarVisible(false);
//     } else {
//       setLeftWidth(savedWidthRef.current);
//       setIsSidebarVisible(true);
//     }
//   }, [isSidebarVisible, leftWidth]);

//   React.useEffect(() => {
//     if (isSidebarVisible && leftWidth > 0) {
//       savedWidthRef.current = leftWidth;
//     }
//   }, [leftWidth, isSidebarVisible]);

//   console.log('LeftPane renders, leftWidth:', leftWidth);

//   const state: PaneState = {
//     leftWidth,
//     isSidebarVisible,
//     savedWidth: savedWidthRef.current,
//     minWidth,
//     maxWidth,
//     toggleSidebar,
//     setLeftWidth,
//   };

//   return <>{children(state)}</>;
// });

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the recommendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        style={backgroundStyle}>
        <View style={{paddingRight: safePadding}}>
          <Header/>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
