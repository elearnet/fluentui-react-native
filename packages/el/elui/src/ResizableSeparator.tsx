import React, { useState, useRef } from 'react';
import { PanResponder, StyleSheet, ViewStyle } from 'react-native';
import HoverableView from './HoverableViewNativeComponent';

export interface ResizableSeparatorProps {
  /** Current width of the left pane */
  leftPaneWidth: number;
  /** Minimum allowed width for the left pane */
  minLeftPaneWidth: number;
  /** Maximum allowed width for the left pane */
  maxLeftPaneWidth: number;
  /** Callback when the pane is resized */
  onResize: (newWidth: number) => void;
  /** Background color of the separator when not hovered */
  backgroundColor: string;
  /** Width of the separator when not hovered (default: 1) */
  separatorNormalWidth?: number;
  /** Width of the separator when hovered (default: 4) */
  separatorHoverWidth?: number;
  /** Whether the separator is hidden (default: false) */
  hidden?: boolean;
  /** Additional styles for the separator */
  style?: ViewStyle;
}

/**
 * A draggable separator component for resizing panes in a split view.
 * Handles hover states and pan gestures for smooth resizing.
 */
export const ResizableSeparator = ({
  leftPaneWidth,
  minLeftPaneWidth,
  maxLeftPaneWidth,
  onResize,
  backgroundColor,
  separatorNormalWidth = 1,
  separatorHoverWidth = 4,
  hidden = false,
  style,
}: ResizableSeparatorProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const initialWidthRef = useRef(leftPaneWidth);
  const leftPaneWidthRef = useRef(leftPaneWidth);

  // Keep leftPaneWidthRef in sync
  React.useEffect(() => {
    leftPaneWidthRef.current = leftPaneWidth;
  }, [leftPaneWidth]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          initialWidthRef.current = leftPaneWidthRef.current;
        },
        onPanResponderMove: (_, gestureState) => {
          onResize(
            Math.max(
              minLeftPaneWidth,
              Math.min(maxLeftPaneWidth, initialWidthRef.current + gestureState.dx)
            )
          );
        },
      }),
    [minLeftPaneWidth, maxLeftPaneWidth, onResize]
  );

  if (hidden) {
    return null;
  }

  return (
    <HoverableView
      style={[
        styles.separator,
        {
          backgroundColor: isHovered ? 'transparent' : backgroundColor,
          width: isHovered ? separatorHoverWidth : separatorNormalWidth,
        },
        style,
      ]}
      {...panResponder.panHandlers}
      // @ts-ignore - for resizing cursor (col-resize, row-resize, ew-resize, ns-resize)
      cursor="ew-resize"
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    height: '100%',
    zIndex: 1,
  },
});

export default ResizableSeparator;
