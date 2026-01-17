import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, } from 'react-native';
import { Workspace, WorkspaceSplit, WorkspaceItem, WorkspaceLeaf } from './Workspace';
import { PaneWithSeparator } from '../PaneWithSeparator';
import {SysIcon} from 'elui-native';
import { DefaultTabRenderer } from './WorkspaceTab';

//import { fontStyles, useFluentTheme } from '@elui-react-native/framework';

const HEADER_HEIGHT = 36;

interface WorkspaceViewProps {
  workspace: Workspace;
  renderLeaf: (leaf: WorkspaceLeaf) => React.ReactNode;
  renderTabGroup?: (split: WorkspaceSplit, activeIndex: number, onSelect: (index: number) => void, headerHeight?: number) => React.ReactNode;
}

const WorkspaceItemRenderer = ({ item, renderLeaf, renderTabGroup }: {
  item: WorkspaceItem,
  renderLeaf: (leaf: WorkspaceLeaf) => React.ReactNode,
  renderTabGroup?: (split: WorkspaceSplit, activeIndex: number, onSelect: (index: number) => void, headerHeight?: number) => React.ReactNode
}) => {
  if (item instanceof WorkspaceSplit) {
    return <WorkspaceSplitRenderer split={item} renderLeaf={renderLeaf} renderTabGroup={renderTabGroup} />;
  } else if (item instanceof WorkspaceLeaf) {
    return <WorkspaceLeafRenderer leaf={item} renderLeaf={renderLeaf} />;
  }
  return null;
};

const WorkspaceSplitRenderer = ({ split, renderLeaf, renderTabGroup }: {
  split: WorkspaceSplit,
  renderLeaf: (leaf: WorkspaceLeaf) => React.ReactNode,
  renderTabGroup?: (split: WorkspaceSplit, activeIndex: number, onSelect: (index: number) => void, headerHeight?: number) => React.ReactNode
}) => {
  const isHorizontal = split.direction === 'horizontal';
  const isTabs = split.direction === 'tabs';

  if (isTabs && renderTabGroup) {
    return (
      <View style={{flex: 1}}>
        {renderTabGroup(split, split.activeIndex, (index) => split.setActiveIndex(index), HEADER_HEIGHT)}
        <View style={{flex: 1}}>
          {split.children[split.activeIndex] && (
            <WorkspaceItemRenderer item={split.children[split.activeIndex]} renderLeaf={renderLeaf} renderTabGroup={renderTabGroup} />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.split, isHorizontal ? styles.splitHorizontal : styles.splitVertical]}>
      {split.children.map((child, index) => (
        <React.Fragment key={index}>
          <View style={styles.childContainer}>
            <WorkspaceItemRenderer item={child} renderLeaf={renderLeaf} renderTabGroup={renderTabGroup} />
          </View>
          {/* Add visual separator here if not last child */}
          {index < split.children.length - 1 && (
            <View style={isHorizontal ? styles.hSeparator : styles.vSeparator} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const WorkspaceLeafRenderer = ({ leaf, renderLeaf }: { leaf: WorkspaceLeaf, renderLeaf: (leaf: WorkspaceLeaf) => React.ReactNode }) => {
  return (
    <View style={styles.leaf}>
      {renderLeaf(leaf)}
    </View>
  );
};



export const WorkspaceView = ({ workspace, renderLeaf, renderTabGroup = DefaultTabRenderer }: WorkspaceViewProps) => {
  const [layoutVersion, setLayoutVersion] = useState(0);

  useEffect(() => {
    const updateLayout = () => setLayoutVersion(v => v + 1);
    workspace.on('layout-change', updateLayout);
  }, [workspace]);

  const hasLeftSplit = workspace.leftSplit && workspace.leftSplit.children.length > 0;
  const isLeftCollapsed = workspace.leftSplit.collapsed;
  const leftSplit = workspace.leftSplit;

  const [buttonWidth, setButtonWidth] = useState(30);

  // Determine button left position in collapsed state:
  const collapsedLeft = leftSplit.minSize - buttonWidth;

  return (
    <View style={styles.container} key={layoutVersion}>
      {/* Left Sidebar Area */}
      <View style={styles.leftArea}>
        {
          hasLeftSplit && ( isLeftCollapsed ? (
            <View style={{width: 0}}>
              {/* Floating Toggle Button when collapsed */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: collapsedLeft,
                height: HEADER_HEIGHT,
                justifyContent: 'center', // Centers vertically
                zIndex: 10,
                paddingBottom: 4, // Visual adjustment for header border (centered in 36px)
              }}>
                <TouchableOpacity
                  onPress={() => workspace.toggleLeftSplit()}
                  style={styles.iconButton}
                >
                  <SysIcon symbolName="sidebar.left" style={{width: 20, height: 20}} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Expanded Sidebar */
            <PaneWithSeparator
              initWidth={leftSplit.size}
              minWidth={leftSplit.minSize}
              maxWidth={leftSplit.maxSize}
              separatorBgColor="transparent"
              onResizeEnd={(width) => leftSplit.setSize(width)}
            >
              {() => (
                <View style={{flex: 1}}>
                  {/* Sidebar Header (Toolbar) */}
                  <View style={styles.sidebarHeader}>
                    {/* Sidebar Switcher Buttons */}
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 70, flex: 1}}>
                      {leftSplit.children.map((child, index) => {
                        const isActive = leftSplit.activeIndex === index;
                        // @ts-ignore - Assuming child is WorkspaceLeaf and has viewState
                        const iconName = child.viewState?.state?.icon || 'questionmark';
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => leftSplit.setActiveIndex(index)}
                            style={[
                              styles.iconButton,
                              { marginLeft: index > 0 ? 8 : 0 },
                              isActive && { backgroundColor: 'rgba(0,0,0,0.1)' }
                            ]}
                          >
                            <SysIcon symbolName={iconName} style={{width: 18, height: 18, tintColor: isActive ? '#000' : '#666'} as any} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <TouchableOpacity
                      onLayout={(event) => {
                        setButtonWidth(event.nativeEvent.layout.width);
                      }}
                      onPress={() => workspace.toggleLeftSplit()}
                      style={styles.iconButton}
                    >
                      <SysIcon symbolName="sidebar.left" style={{width: 20, height: 20}} />
                    </TouchableOpacity>
                  </View>
                  {/* Sidebar Content */}
                  <View style={{flex: 1}}>
                    {leftSplit.children[leftSplit.activeIndex] && (
                      <WorkspaceItemRenderer
                        item={leftSplit.children[leftSplit.activeIndex]}
                        renderLeaf={renderLeaf}
                        renderTabGroup={renderTabGroup}
                      />
                    )}
                  </View>
                </View>
              )}
            </PaneWithSeparator>
          ))
        }
      </View>

      {/* Main Area */}
      <View style={styles.mainArea}>
        <WorkspaceItemRenderer item={workspace.rootSplit} renderLeaf={renderLeaf} renderTabGroup={renderTabGroup} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftArea: {
    flexDirection: 'row', // To perform layout correctly
  },
  sidebarHeader: {
    height: HEADER_HEIGHT,
    paddingLeft: 10,
    paddingRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Toggle button on right
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Subtle separator
  },
  iconButton: {
    padding: 4,
    borderRadius: 4,
  },
  mainArea: {
    flex: 1,
  },
  split: {
    flex: 1,
  },
  splitHorizontal: {
    flexDirection: 'column',
  },
  splitVertical: {
    flexDirection: 'row',
  },
  childContainer: {
    flex: 1,
  },
  leaf: {
    flex: 1,
    backgroundColor: 'white'
  },
  // Separators
  hSeparator: { height: 1, backgroundColor: 'black' },
  vSeparator: { width: 1, backgroundColor: 'black' },
});
