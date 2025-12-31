import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Workspace, WorkspaceSplit, WorkspaceItem, WorkspaceLeaf } from './Workspace';
import { PaneWithSeparator } from '../PaneWithSeparator';
import SysIcon from '../SysIconNativeComponent';
import { TabList, Tab } from '@elui-react-native/tablist';
import { default as HoverableView } from '../HoverableViewNativeComponent';
import { default as SystemColors } from '../NativeSystemColors';
import { fontStyles, useFluentTheme } from '@elui-react-native/framework';
import { Callout } from '@elui-react-native/callout';

const HEADER_HEIGHT = 36;

interface WorkspaceViewProps {
  workspace: Workspace;
  renderLeaf: (leaf: WorkspaceLeaf) => React.ReactNode;
  renderTabGroup?: (split: WorkspaceSplit, activeIndex: number, onSelect: (index: number) => void) => React.ReactNode;
}

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

interface HoverableTabContentProps {
  icon?: string;
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

  // If no icon, use a default document icon
  const safeIcon = icon || "doc.text";

  return (
    <HoverableView
      onHoverIn={() => setIsHovered(true && !isSelected)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.tabContent,
        isHovered && styles.tabContentHovered,
      ]}
    >
      <SysIcon symbolName={safeIcon} style={styles.tabIcon} />
      <Text style={textStyle}>{title}</Text>
      <CloseButton onPress={onClose} />
    </HoverableView>
  );
};

const WorkspaceItemRenderer = ({ item, renderLeaf, renderTabGroup }: {
  item: WorkspaceItem,
  renderLeaf: (leaf: WorkspaceLeaf) => React.ReactNode,
  renderTabGroup?: (split: WorkspaceSplit, activeIndex: number, onSelect: (index: number) => void) => React.ReactNode
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
  renderTabGroup?: (split: WorkspaceSplit, activeIndex: number, onSelect: (index: number) => void) => React.ReactNode
}) => {
  const isHorizontal = split.direction === 'horizontal';
  const isTabs = split.direction === 'tabs';

  if (isTabs && renderTabGroup) {
    return (
      <View style={{flex: 1}}>
        {renderTabGroup(split, split.activeIndex, (index) => split.setActiveIndex(index))}
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

// Extracted Tab Component to handle Refs correctly
const WorkspaceTab = ({
                        child,
                        index,
                        isActive,
                        onLongPress,
                        onClose,
                        showSeparator,
                        detailBgColor
                      }: {
  child: any,
  index: number,
  isActive: boolean,
  onLongPress: (index: number, ref: React.RefObject<any>) => void,
  onClose: () => void,
  showSeparator: boolean,
  detailBgColor: string
}) => {
  // Use a wrapper view for reliable anchoring of the Context Menu (Callout)
  const wrapperRef = React.useRef<View>(null);
  const title = child.viewState?.state?.title || child.viewState?.type || `Tab ${index + 1}`;
  const icon = child.viewState?.state?.icon;
  const tabKey = index.toString();

  return (
    <View
      ref={wrapperRef}
      style={{ flex: 1, flexDirection: 'row' }}
    >
      <Tab
        key={tabKey}
        tabKey={tabKey}
        // No componentRef passed to Tab, we rely on wrapperRef
        onLongPress={() => {
          if (wrapperRef.current) {
            onLongPress(index, wrapperRef);
          }
        }}
        onPressIn={(e: any) => {
          if (e.nativeEvent.button === 2 && wrapperRef.current) {
            // Optional: Trigger on right click immediately if platform supports
            // onLongPress(index, wrapperRef);
          }
        }}
        showSeparator={showSeparator}
        showInvertedCorners={isActive}
        cornerColor={detailBgColor}
        style={[styles.tab, {
          backgroundColor: isActive ? detailBgColor : 'transparent',
          flex: 1, // Fill the wrapper
        }]}
      >
        <HoverableTabContent
          icon={icon}
          title={title}
          isSelected={isActive}
          onClose={onClose}
        />
      </Tab>
    </View>
  );
};

const ContextMenuItem = ({ icon, text, onPress }: { icon: string, text: string, onPress: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <HoverableView
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 }}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <TouchableOpacity onPress={onPress} style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        <View style={[
          StyleSheet.absoluteFill,
          { backgroundColor: isHovered ? '#0078d4' : 'transparent', borderRadius: 4, opacity: isHovered ? 0.2 : 0 }
        ]} />
        <SysIcon symbolName={icon} style={{ width: 14, height: 14, marginRight: 8, tintColor: '#000' } as any} />
        <Text style={{ fontSize: 13 }}>{text}</Text>
      </TouchableOpacity>
    </HoverableView>
  );
};

const DefaultTabRenderer = (split: WorkspaceSplit, activeIndex: number, onSelect: (index: number) => void) => {
  const workspace = split.workspace;
  const isLeftCollapsed = workspace.leftSplit && workspace.leftSplit.children.length > 0 && workspace.leftSplit.collapsed;
  const minSidePaneWidth = workspace.leftSplit.minSize;

  const [contextMenuTarget, setContextMenuTarget] = React.useState<React.RefObject<any> | null>(null);
  const [isContextMenuVisible, setIsContextMenuVisible] = React.useState(false);
  const [contextMenuIndex, setContextMenuIndex] = React.useState(-1);

  // Helper to ensure valid selection key
  const safeSelectValue = (split: WorkspaceSplit, index: number) => {
    if (!split.children[index]) return "0";
    return index.toString();
  };
  const detailBgColor = SystemColors.getSystemColor('unemphasizedSelectedContentBackgroundColor') || '#E0E0E0';
  const selectedKey = safeSelectValue(split, activeIndex);

  const onTabLongPress = React.useCallback((index: number, ref: React.RefObject<any>) => {
    setContextMenuIndex(index);
    setContextMenuTarget(ref);
    setIsContextMenuVisible(true);
  }, []);

  return (
    <View style={[styles.tabListContainer, isLeftCollapsed ? { marginLeft: minSidePaneWidth } : {}]}>
      <TabList
        selectedKey={selectedKey}
        onTabSelect={(key: string) => {
          const idx = parseInt(key, 10);
          onSelect(idx);
        }}
        appearance="subtle"
        size="small"
        style={styles.tabList}
      >
        {split.children.map((child: any, index: number) => {
          const tabKey = index.toString();
          const isSelected = tabKey === selectedKey;
          const isLast = index === split.children.length - 1;
          const nextKey = (index + 1).toString();
          const showSeparator = selectedKey !== tabKey && selectedKey !== nextKey && !isLast;

          return (
            <WorkspaceTab
              key={tabKey}
              child={child}
              index={index}
              isActive={isSelected}
              onLongPress={onTabLongPress}
              onClose={() => split.removeChild(child)}
              showSeparator={showSeparator}
              detailBgColor={detailBgColor}
            />
          );
        })}
      </TabList>


      {isContextMenuVisible && contextMenuTarget && (
        <Callout
          target={contextMenuTarget}
          onDismiss={() => setIsContextMenuVisible(false)}
          style={{
            backgroundColor: '#fff',
            borderWidth: 0.5,
            borderColor: 'rgba(0,0,0,0.2)',
            padding: 4,
            borderRadius: 6,
            minWidth: 160,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <ContextMenuItem
            icon="xmark"
            text="Close Tab"
            onPress={() => {
              const child = split.children[contextMenuIndex];
              if (child) split.removeChild(child);
              setIsContextMenuVisible(false);
            }}
          />
          <ContextMenuItem
            icon="arrow.left.and.right"
            text="Close Others"
            onPress={() => {
              const targetChild = split.children[contextMenuIndex];
              [...split.children].forEach(child => {
                if(child !== targetChild) split.removeChild(child);
              });
              setIsContextMenuVisible(false);
            }}
          />
          <ContextMenuItem
            icon="arrow.right.to.line"
            text="Close to the Right"
            onPress={() => {
              [...split.children].forEach((child, idx) => {
                if(idx > contextMenuIndex) split.removeChild(child);
              });
              setIsContextMenuVisible(false);
            }}
          />
        </Callout>
      )}
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
  tabListContainer: {
    flexDirection: 'row',
    height: HEADER_HEIGHT,
    paddingTop: 0,
    paddingLeft: 10,
    alignItems: 'flex-end', // Anchor tabs to bottom for inverted corners
    // flex: 1, // Removed to prevent it from growing vertically in column layout
    width: '100%', // Ensure it spans full width
    //width:2000,
    overflow: 'visible', // Ensure decorations aren't clipped
    //backgroundColor: 'red',
  },
  tabList:{
    flex:1, height: 27,
    width: '100%',
    // backgroundColor: 'red',
  },
  // Chrome-style Tab Styles
  tab:{
    height: 27,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 0, // No rounding at bottom (inverted corners handle this)
    borderBottomRightRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    //width:120,
    // flex: 1,Auto width, don't work,  Slots.container(FocusZone) causing the issue??
    // fixed by adding style={vertical?{height:'100%'}:{width:'100%'}} to TabList's Slots.container
    flex: 1,
    //maxWidth: 200,
    //minWidth: 100,
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
});
