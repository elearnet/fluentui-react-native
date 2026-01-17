import React,{ useState } from 'react';
import { TabList, Tab } from '@elui-react-native/tablist';
import { ContextualMenu, ContextualMenuItem } from '@elui-react-native/contextual-menu';
import {SysIcon,HoverableView,SystemColors} from 'elui-native';
import { fontStyles, useFluentTheme } from '@elui-react-native/framework';

import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WorkspaceSplit} from './Workspace';

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
  height?: number;
}
const HoverableTabContent = ({ icon, title, isSelected, onClose, height }: HoverableTabContentProps) => {
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
        height ? { height: height - 11 } : {}
      ]}
    >
      <SysIcon symbolName={safeIcon} style={styles.tabIcon} />
      <Text style={textStyle}>{title}</Text>
      <CloseButton onPress={onClose} />
    </HoverableView>
  );
};

// Extracted Tab Component to handle Refs correctly
const WorkspaceTab = ({
                        child,
                        index,
                        isActive,
                        onClose,
                        showSeparator,
                        detailBgColor,
                        onContextMenu,
                        headerHeight
                      }: {
  child: any,
  index: number,
  isActive: boolean,
  onClose: () => void,
  showSeparator: boolean,
  detailBgColor: string,
  onContextMenu?: (index: number, target: React.RefObject<any>) => void,
  headerHeight?: number
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
        onPressIn={(e: any) => {
          if (e.nativeEvent.button === 2 && wrapperRef.current && onContextMenu) {
             onContextMenu(index, wrapperRef);
          }
        }}
        showSeparator={showSeparator}
        showInvertedCorners={isActive}
        cornerColor={detailBgColor}
        style={[styles.tab, {
          backgroundColor: isActive ? detailBgColor : 'transparent',
          flex: 1, // Fill the wrapper
        }, headerHeight ? { height: headerHeight - 9 } : {}]}
      >
        <HoverableTabContent
          icon={icon}
          title={title}
          isSelected={isActive}
          onClose={onClose}
          height={headerHeight}
        />
      </Tab>
    </View>
  );
};



const DefaultTabGroup = ({ split, activeIndex, onSelect, headerHeight }: { split: WorkspaceSplit, activeIndex: number, onSelect: (index: number) => void, headerHeight?: number }) => {
  const workspace = split.workspace;
  const isLeftCollapsed = workspace.leftSplit && workspace.leftSplit.children.length > 0 && workspace.leftSplit.collapsed;
  const minSidePaneWidth = workspace.leftSplit.minSize;

  /* Context Menu State */
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

  const onTabContextMenu = React.useCallback((index: number, target: React.RefObject<any>) => {
    // console.log('onTabContextMenu target:',target)
    setContextMenuTarget(target);
    setContextMenuIndex(index);
    setIsContextMenuVisible(true);
  }, []);

  const onDismissContextMenu = React.useCallback(() => {
    setIsContextMenuVisible(false);
    setContextMenuTarget(null);
  }, []);

  const handleContextMenuItemClick = React.useCallback((key: string) => {
    if (contextMenuIndex === -1) return;

    const child = split.children[contextMenuIndex];

    switch (key) {
      case 'close':
        split.removeChild(child);
        break;
      case 'closeOthers':
        // Close all except current
        // We need to iterate backwards to avoid index shifting issues or create a list to remove
        const childrenToRemove = split.children.filter((_, idx) => idx !== contextMenuIndex);
        childrenToRemove.forEach(c => split.removeChild(c));
        break;
      case 'closeRight':
        // Close all to the right
        const rightChildren = split.children.filter((_, idx) => idx > contextMenuIndex);
        rightChildren.forEach(c => split.removeChild(c));
        break;
    }

    onDismissContextMenu();
  }, [contextMenuIndex, split, onDismissContextMenu]);

  return (
    <View collapsable={false} style={[styles.tabListContainer, isLeftCollapsed ? { marginLeft: minSidePaneWidth } : {}, headerHeight ? { height: headerHeight } : {}]}>
      <TabList
        selectedKey={selectedKey}
        onTabSelect={(key: string) => {
          const idx = parseInt(key, 10);
          onSelect(idx);
        }}
        appearance="subtle"
        size="small"
        style={[styles.tabList, headerHeight ? { height: headerHeight - 9 } : {}]}
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
              onClose={() => split.removeChild(child)}
              showSeparator={showSeparator}
              detailBgColor={detailBgColor}
              onContextMenu={onTabContextMenu}
              headerHeight={headerHeight}
            />
          );
        })}
      </TabList>
      {isContextMenuVisible && contextMenuTarget && (
        <ContextualMenu
          target={contextMenuTarget}
          onDismiss={onDismissContextMenu}
          onShow={() => {}}
          shouldFocusOnMount={true}
          onItemClick={handleContextMenuItemClick}
        >
          <ContextualMenuItem text="Close" itemKey="close" />
          <ContextualMenuItem text="Close Others" itemKey="closeOthers" />
          <ContextualMenuItem text="Close to the Right" itemKey="closeRight" />
        </ContextualMenu>
      )}
    </View>
  );
};
export const DefaultTabRenderer = (split: WorkspaceSplit, activeIndex: number, onSelect: (index: number) => void, headerHeight?: number) => {
    return <DefaultTabGroup split={split} activeIndex={activeIndex} onSelect={onSelect} headerHeight={headerHeight} />;
};
const HEADER_HEIGHT = 36;
const styles = StyleSheet.create({
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
    flex:1, height: HEADER_HEIGHT-9,
    width: '100%',
    // backgroundColor: 'red',
  },
  // Chrome-style Tab Styles
  tab:{
    height: HEADER_HEIGHT-9,
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
    height: HEADER_HEIGHT-11,
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
