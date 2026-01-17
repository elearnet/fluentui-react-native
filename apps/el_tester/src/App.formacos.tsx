import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Pressable, StyleSheet} from 'react-native';
import { ThemeProvider, ThemeReference } from '@elui-react-native/theme';
import { createAppleTheme } from '@elui-react-native/apple-theme';
import { callback } from 'react-native-nitro-modules';
// import {ELUIView, NitrotestHybridObject,} from 'elui-native';
import {
  App,
  WorkspaceView,
  WorkspaceLeaf,
} from 'elui';

import { NoteListView } from './UI/NoteListView';
import {SearchView} from './UI/SearchView.tsx';
import {MarkdownView} from './UI/MarkdownView.tsx';
import {TestCallout as TestNitroCallout} from '@elui-react-native/callout';
import {CompatibleNitroView /*,TestNitroCallout*/} from 'etest';
import {FocusZone, RCTFocusZone} from '@elui-react-native/focus-zone';

const baseTheme = createAppleTheme();

const focusButtonStyle = {
  padding: 12,
  backgroundColor: '#007804',
  borderRadius: 6,
  minWidth: 60,
  alignItems: 'center' as const,
};

const focusedButtonStyle = {
  borderWidth: 3,
  backgroundColor: '#f078d4',
  borderColor: '#ffff00',
  shadowColor: '#0078d4',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 8,
};

// FocusZone Context for sharing focus state with children
const FocusZoneContext = React.createContext<{
  focusedIndex: number;
}>({ focusedIndex: -1 });

// FocusZone wrapper that handles onFocusChange and provides context
const FocusZoneWithState = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  focusZoneDirection?: 'horizontal' | 'vertical' | 'bidirectional' | 'none';
  style?: any;
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleFocusChange = (event: { nativeEvent: { focusedIndex: number; focusedTag: number } }) => {
    console.log('[FocusZoneWithState] onFocusChange:', event.nativeEvent);
    setFocusedIndex(event.nativeEvent.focusedIndex);
  };

  return (
    <FocusZoneContext.Provider value={{ focusedIndex }}>
      <RCTFocusZone
        {...props}
        onFocusChange={handleFocusChange}
      >
        {children}
      </RCTFocusZone>
    </FocusZoneContext.Provider>
  );
};

// FocusableButton that uses context to determine if it's focused
const FocusZoneButton = ({
  children,
  index,
  onPress
}: {
  children: React.ReactNode;
  index: number;
  onPress?: () => void;
}) => {
  const { focusedIndex } = React.useContext(FocusZoneContext);
  const isFocused = focusedIndex === index;

  return (
    <Pressable
      onPress={onPress}
      style={[
        focusButtonStyle,
        isFocused && focusedButtonStyle,
      ]}
    >
      <Text style={{ color: 'white' }}>{children}</Text>
    </Pressable>
  );
};

// Simple FocusableButton for individual use (without FocusZone context)
const FocusableButton = ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      focusable={true}
      onPress={onPress}
      onFocus={() => {
        console.log('[FocusableButton] onFocus');
        setIsFocused(true);
      }}
      onBlur={() => {
        console.log('[FocusableButton] onBlur');
        setIsFocused(false);
      }}
      style={({ pressed }) => [
        focusButtonStyle,
        isFocused && focusedButtonStyle,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={{ color: 'white' }}>{children}</Text>
    </Pressable>
  );
};
const customTheme = new ThemeReference(baseTheme, {
  components: {
    Tab:{
      indicatorThickness:0,
      //backgroundColor:'red',
      // Note: Don't set borderRadius here - it overrides inline corner styles
      small:{
        indicatorMargin: 0,
        //backgroundColor:'red',
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
      // selected:{
      //   backgroundColor: 'grey', // Match your styles.detail.backgroundColor
      // },
    }
  },
});
// customTheme.theme.colors.bodyFrameBackground

//console.log(NitrotestHybridObject);
//const result = NitrotestHybridObject.multiply(2, 3);
//<Text>nitro test result:{result}</Text>
          // <ELUIView color="plus.circle.fill" style={{width:30,height:30,backgroundColor:'grey'}} />

import { ContextualMenu, ContextualMenuItem } from '@elui-react-native/contextual-menu';
import { ButtonV1 as Button } from '@elui-react-native/button';
const styles2 = StyleSheet.create({
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
const BasicContextualMenuTest = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const anchorRef = React.useRef<View>(null);

  return (
    <View style={styles2.section} nativeID="section-basic-menu">
      <Text style={styles2.sectionTitle}>1. Basic ContextualMenu</Text>
      <Text style={styles2.label}>Click button to open menu, use arrow keys to navigate</Text>

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
export default function AppRoot() {
  // Singleton App instance
  const [app] = useState(() => {
      const a = new App();
      // Configure root split as tabs for this app
      a.workspace.rootSplit.direction = 'tabs';
      return a;
  });

  useEffect(() => {
    app.onload();

    // Initialize Sidebar (Clear first to be robust against hot reloads/strict mode)
    app.workspace.leftSplit.children = [];
    // Configure Sidebar sizing
    app.workspace.leftSplit.minSize = 150;
    app.workspace.leftSplit.maxSize = 600;
    app.workspace.leftSplit.size = 250;

    const leftLeaf = new WorkspaceLeaf(app.workspace);
    leftLeaf.setViewState({ type: 'file-explorer', state: {icon:'folder'} });
    app.workspace.leftSplit.addChild(leftLeaf);
    const leftLeaf2 = new WorkspaceLeaf(app.workspace);
    leftLeaf2.setViewState({ type: 'search-view', state: {icon:'magnifyingglass'} });
    app.workspace.leftSplit.addChild(leftLeaf2);
    app.workspace.leftSplit.activeIndex = 0;
    //console.log('Sidebar initialized. Children count:', app.workspace.leftSplit.children.length);


    // Initialize Main Area
    // const leaf = app.workspace.getLeaf(true);
    // leaf.setViewState({ type: 'example', state: { text: 'Hello World 1', title: 'Tab1' } });
    // leaf.view = "Example View"; // Placeholder

    /*
    // To add a SECOND tab, we explicitly create a new leaf and add it to the rootSplit
    const leaf2 = new WorkspaceLeaf(app.workspace);
    app.workspace.rootSplit.addChild(leaf2);
    leaf2.setViewState({ type: 'example', state: { text: 'Hello World 2', title: 'Tab2' } });
    leaf2.view = "Example View";

    const leaf3 = new WorkspaceLeaf(app.workspace);
    app.workspace.rootSplit.addChild(leaf3);
    leaf3.setViewState({ type: 'example', state: { text: 'Hello World 3', title: 'Tab3' } });
    leaf3.view = "Example View";

    const leaf4 = new WorkspaceLeaf(app.workspace);
    app.workspace.rootSplit.addChild(leaf4);
    const testMarkdown = `
# Markdown Test

## Text Formatting
This is **bold** text and this is *italic* text.
This is ~~strikethrough~~.

## Lists
- Item 1
- Item 2
  - Subitem A
  - Subitem B

1. Ordered Item 1
2. Ordered Item 2

## Code
Inline code: \`const a = 1;\`

Code block:
\`\`\`typescript
function hello() {
  console.log("Hello World");
}
\`\`\`

## Quotes
> This is a blockquote.
> It can span multiple lines.

## Links
[Fluent UI React Native](https://github.com/microsoft/fluentui-react-native)
        `;
    leaf4.setViewState({ type: 'markdown', state: { content: testMarkdown, title: 'Tab4' } });
    leaf4.view = "Markdown View";

    const leaf5 = new WorkspaceLeaf(app.workspace);
    app.workspace.rootSplit.addChild(leaf5);
    leaf5.setViewState({ type: 'callout-test', state: {  } });

    const leaf6 = new WorkspaceLeaf(app.workspace);
    app.workspace.rootSplit.addChild(leaf6);
    leaf6.setViewState({ type: 'focuszone-test', state: {  } });*/
    const leaf7 = new WorkspaceLeaf(app.workspace);
    app.workspace.rootSplit.addChild(leaf7);
    leaf7.setViewState({ type: 'contextual-menu-test', state: {  } });


    return () => app.onunload();
  }, [app]);
  const [counter, setCounter] = useState(0);
  const counterRef = React.useRef<CompatibleNitroView | null>(null);
  const renderLeaf = React.useCallback((leaf: any) => {
    const type = leaf.viewState?.type;
    if (type === 'file-explorer') {
      return <NoteListView />;
    }
    if (type === 'search-view') {
        return <SearchView />;
    }
    if (type === 'markdown') {
        const content =  leaf.viewState.state?.content || leaf.viewState.state?.data ;
        return <MarkdownView content={content} />;
    }
    if (type === 'example') {

      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Example View: {leaf.viewState.state?.text || 'Hello World'}</Text>
          <TouchableOpacity
            onPress={():void=>{
              counterRef.current?.reset();
            }}
            style={{width:60,height:60}}
          >
            <CompatibleNitroView color="#a53f56"
                                 onTick={callback((count:number) => {
                                setCounter(count);
                            })}
                            startFrom={5}
                            style={{width:60,height:60}}
                            hybridRef={{
                              f: (ref:any) => {
                                counterRef.current = ref
                              },
                            }}
            >
            </CompatibleNitroView>
          </TouchableOpacity>
          <Text style={{backgroundColor:'#ffffff'}}>{counter}</Text>
        </View>
      );
    };
    if(type==="callout-test"){
      return (<TestNitroCallout />)
    }
    if(type==="focuszone-test"){
      console.log('[FocusZoneTest] Rendering FocusZone test view');
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ marginTop: 20, color: '#666' }}>
            Use Tab to move between zones, arrow keys to navigate within zones.
          </Text>
          {/* Direct native component test with onFocusChange */}
          <Text style={{ marginTop: 20, marginBottom: 8, fontWeight: 'bold' }}>FocusZone with onFocusChange Event:</Text>
          <FocusZoneWithState focusZoneDirection="horizontal" style={{ padding: 10, flexDirection: 'row', gap: 8 }}>
            <FocusZoneButton index={0}>Btn 1</FocusZoneButton>
            <FocusZoneButton index={1}>Btn 2</FocusZoneButton>
            <FocusZoneButton index={2}>Btn 3</FocusZoneButton>
            <FocusZoneButton index={3}>Btn 4</FocusZoneButton>
          </FocusZoneWithState>

          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>FocusZone Test</Text>
          {/* Horizontal FocusZone */}
          <Text style={{ marginBottom: 8 }}>Horizontal Zone (← →)</Text>
          <FocusZone focusZoneDirection="horizontal" style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            <FocusableButton>Btn 1</FocusableButton>
            <FocusableButton>Btn 2</FocusableButton>
            <FocusableButton>Btn 3</FocusableButton>
            <FocusableButton>Btn 4</FocusableButton>
          </FocusZone>

          {/* Vertical FocusZone */}
          <Text style={{ marginBottom: 8 }}>Vertical Zone (↑ ↓)</Text>
          <FocusZone focusZoneDirection="vertical" style={{ gap: 8, marginBottom: 20 }}>
            <FocusableButton>Item A</FocusableButton>
            <FocusableButton>Item B</FocusableButton>
            <FocusableButton>Item C</FocusableButton>
          </FocusZone>

          {/* Bidirectional FocusZone (Grid) */}
          <Text style={{ marginBottom: 8 }}>Bidirectional Zone (Grid)</Text>
          <FocusZone focusZoneDirection="bidirectional" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, maxWidth: 280 }}>
            <FocusableButton>Grid 1</FocusableButton>
            <FocusableButton>Grid 2</FocusableButton>
            <FocusableButton>Grid 3</FocusableButton>
            <FocusableButton>Grid 4</FocusableButton>
            <FocusableButton>Grid 5</FocusableButton>
            <FocusableButton>Grid 6</FocusableButton>
          </FocusZone>
        </View>
      )
    }
    if (type === 'contextual-menu-test') {
      return <BasicContextualMenuTest />;
    }

    return <Text>Unknown View Type: {type}</Text>;
  }, [counter]);

  return (
    <ThemeProvider theme={customTheme}>
      <WorkspaceView workspace={app.workspace} renderLeaf={renderLeaf} />
    </ThemeProvider>
    //<WorkspaceView workspace={app.workspace} renderLeaf={renderLeaf} />
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: 'transparent',
//   },
// });
