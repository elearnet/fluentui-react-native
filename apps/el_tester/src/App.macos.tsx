import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { ThemeProvider, ThemeReference } from '@elui-react-native/theme';
import { createAppleTheme } from '@elui-react-native/apple-theme';
import {CompatibleView} from 'etest';
import {
  App,
  WorkspaceView,
  WorkspaceLeaf,
  ELUIView,
  NitrotestHybridObject,
} from 'elui';

import { NoteListView } from './UI/NoteListView';
import {SearchView} from './UI/SearchView.tsx';
import {MarkdownView} from './UI/MarkdownView.tsx';


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

//console.log(NitrotestHybridObject);
const result = NitrotestHybridObject.multiply(2, 3);

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
    console.log('Sidebar initialized. Children count:', app.workspace.leftSplit.children.length);


    // Initialize Main Area
    const leaf = app.workspace.getLeaf(true);
    leaf.setViewState({ type: 'example', state: { text: 'Hello World 1', title: 'Tab1' } });
    leaf.view = "Example View"; // Placeholder

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

    return () => app.onunload();
  }, [app]);

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
          <Text>nitro test result:{result}</Text>
          <ELUIView color="plus.circle.fill" style={{width:30,height:30,backgroundColor:'grey'}} />
          <CompatibleView color="#123456" style={{width:60,height:60}} />
        </View>
      );
    };
    return <Text>Unknown View Type: {type}</Text>;
  }, []);

  return (
    <ThemeProvider theme={customTheme}>
      <WorkspaceView workspace={app.workspace} renderLeaf={renderLeaf} />
    </ThemeProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: 'transparent',
//   },
// });
