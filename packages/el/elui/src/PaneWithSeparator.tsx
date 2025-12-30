import React, { useState } from 'react';
import { View } from 'react-native';
import { ResizableSeparator } from './ResizableSeparator';

// Pane state and render props interface
export interface PaneState {
  paneWidth: number;
  setPaneWidth: (width: number) => void;
}

export interface PaneWithSeparatorProps {
  initWidth: number;
  minWidth: number;
  maxWidth: number;
  separatorBgColor: string;
  onResizeEnd?: (width: number) => void;
  children: (state: PaneState) => React.ReactNode;
}

export const PaneWithSeparator = React.memo(({
  initWidth,
  minWidth,
  maxWidth,
  separatorBgColor,
  children,
  onResizeEnd,
}: PaneWithSeparatorProps) => {
  const [paneWidth, setPaneWidth] = useState(initWidth);
  const state: PaneState = {
    paneWidth,
    setPaneWidth,
  };
  return (
    <>
      <View style={{ width: paneWidth }}>
        {children(state)}
      </View>
      <ResizableSeparator
        paneWidth={paneWidth}
        minPaneWidth={minWidth}
        maxPaneWidth={maxWidth}
        onResize={setPaneWidth}
        onResizeEnd={onResizeEnd}
        backgroundColor={separatorBgColor}
        hidden={paneWidth==0}
      />
    </>
  );
});
