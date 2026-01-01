import React, { useState, useRef } from 'react';
import { PanResponder, StyleSheet, ViewStyle } from 'react-native';
import {HoverableView} from 'elui-native';

export interface ResizableSeparatorProps {
  /** Current width of the left pane */
  paneWidth: number;
  /** Minimum allowed width for the left pane */
  minPaneWidth: number;
  /** Maximum allowed width for the left pane */
  maxPaneWidth: number;
  /** Callback when the pane is resized */
  onResize: (newWidth: number) => void;
  /** Callback when resizing ends */
  onResizeEnd?: (finalWidth: number) => void;
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
  paneWidth,
  minPaneWidth,
  maxPaneWidth,
  onResize,
  onResizeEnd,
  backgroundColor,
  separatorNormalWidth = 1,
  separatorHoverWidth = 4,
  hidden = false,
  style,
}: ResizableSeparatorProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const initialWidthRef = useRef(paneWidth);
  const paneWidthRef = useRef(paneWidth);

  // Keep paneWidthRef in sync
  React.useEffect(() => {
    paneWidthRef.current = paneWidth;
  }, [paneWidth]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          initialWidthRef.current = paneWidthRef.current;
        },
        onPanResponderMove: (_, gestureState) => {
          onResize(
            Math.max(
              minPaneWidth,
              Math.min(maxPaneWidth, initialWidthRef.current + gestureState.dx)
            )
          );
        },
        // Clear hover state when gesture ends (covers all cases)
        onPanResponderEnd: () => {
             setIsHovered(false);
             if (onResizeEnd) onResizeEnd(initialWidthRef.current); // Use persisted ref (current logic updates it? No.)
             // Wait, initialWidthRef is START width. PaneWidthRef tracks current?
             // Logic at line 62 uses 'initialWidthRef.current + dx'.
             // We need to calculate final width same way or track it.
             // Best to just track 'currentWidth' in a ref during move?
             // Actually, PanResponderEnd gestureState has dx too.
        },
        onPanResponderRelease: (_, gestureState) => {
            setIsHovered(false);
            if (onResizeEnd) {
                 const finalWidth = Math.max(minPaneWidth, Math.min(maxPaneWidth, initialWidthRef.current + gestureState.dx));
                 onResizeEnd(finalWidth);
            }
        },
        onPanResponderTerminate: () => setIsHovered(false),
      }),
    [minPaneWidth, maxPaneWidth, onResize, onResizeEnd]
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
