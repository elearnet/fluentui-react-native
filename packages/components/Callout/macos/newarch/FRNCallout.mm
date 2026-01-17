#import "FRNCallout.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/FRNCalloutSpec/ComponentDescriptors.h>
#import <react/renderer/components/FRNCalloutSpec/EventEmitters.h>
#import <react/renderer/components/FRNCalloutSpec/Props.h>
#import <react/renderer/components/FRNCalloutSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import "CalloutWindow.h"

#import "ProxyView.h"
#import <React/RCTSurfaceTouchHandler.h>

#import "Helper.h"

using namespace facebook::react;


@implementation FRNCallout {
  FRNCalloutWindow *_panel;
  FRNProxyView *_proxyView;
  RCTSurfaceTouchHandler *_touchHandler;
  NSInteger _pendingTarget; // Store target to apply when view moves to window
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<FRNCalloutComponentDescriptor>();
}

- (FRNCalloutWindow *)panel {
  if (!_panel) {
    _panel = [[FRNCalloutWindow alloc] initWithContentRect:NSZeroRect
                                        styleMask:NSWindowStyleMaskBorderless | NSWindowStyleMaskNonactivatingPanel
                                          backing:NSBackingStoreBuffered
                                            defer:NO];
    _panel.backgroundColor = [NSColor clearColor];
    _panel.opaque = NO;
    _panel.contentView.wantsLayer = YES;
    _panel.contentView.layer.backgroundColor = [NSColor clearColor].CGColor;
    _panel.delegate = self;
    [_panel.contentView addSubview:self.proxyView];

    if (self.window) {
      [self.window addChildWindow:_panel ordered:NSWindowAbove];
    }
  }
  return _panel;
}

- (FRNProxyView *)proxyView {
  if (!_proxyView) {
    _proxyView = [[FRNProxyView alloc] initWithFrame:NSZeroRect];
    _proxyView.wantsLayer = YES;
    _proxyView.layer.backgroundColor = [NSColor clearColor].CGColor;

    _touchHandler = [RCTSurfaceTouchHandler new];
    [_touchHandler attachToView:(RCTUIView *)_proxyView];
  }
  return _proxyView;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::shared_ptr<const FRNCalloutProps>(new FRNCalloutProps());
    _props = defaultProps;
  }
  return self;
}

- (void)mountChildComponentView:(NSView<RCTComponentViewProtocol> *)child
                          index:(NSInteger)index
{
  DevLog(@"[Callout] mountChildComponentView triggered");
  [self.proxyView addSubview:child];
}

- (void)unmountChildComponentView:(NSView<RCTComponentViewProtocol> *)child
                            index:(NSInteger)index
{
  DevLog(@"[Callout] unmountChildComponentView triggered");
  [child removeFromSuperview];
}

- (void)viewDidMoveToWindow
{
  DevLog(@"[Callout] viewDidMoveToWindow triggered");
  [super viewDidMoveToWindow];

  if (self.window) {
    [self showCallout];
  } else {
    [self dismissCallout];
  }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<FRNCalloutProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<FRNCalloutProps const>(props);

    // Handle target prop - store for use in showCallout (timing issue: updateProps called before viewDidMoveToWindow)
    if (oldViewProps.target != newViewProps.target) {
        _pendingTarget = newViewProps.target;
        if (_pendingTarget != 0) {
            DevLog(@"[Callout] target updated: %ld", (long)_pendingTarget);
            // Try to update immediately if window is already available
            if (self.window) {
                [self updateWindowPositionFromTarget:_pendingTarget];
            }
            // If window not ready yet, showCallout will use _pendingTarget when called
        }
    }

    // Handle anchorRect prop (fallback if no target)
    BOOL anchorRectChanged = oldViewProps.anchorRect.screenX != newViewProps.anchorRect.screenX ||
        oldViewProps.anchorRect.screenY != newViewProps.anchorRect.screenY ||
        oldViewProps.anchorRect.width != newViewProps.anchorRect.width ||
        oldViewProps.anchorRect.height != newViewProps.anchorRect.height;

    // Only use anchorRect if target is not set
    if (anchorRectChanged && newViewProps.target <= 0) {
        DevLog(@"[Callout] anchorRect updated: x=%f, y=%f, w=%f, h=%f",
              newViewProps.anchorRect.screenX,
              newViewProps.anchorRect.screenY,
              newViewProps.anchorRect.width,
              newViewProps.anchorRect.height);

        // Update window position based on anchorRect here if needed
        [self updateWindowPosition:newViewProps.anchorRect];
    }

    if (oldViewProps.borderRadii != newViewProps.borderRadii) {
      [self updateWindowRadius:newViewProps.borderRadii];
    }

//    if (oldViewProps.borderColors != newViewProps.borderColors) {
//        CGColorRef borderColor = nil;
//        if (newViewProps.borderColors.all.has_value()) {
//            borderColor = [NSColor colorWithCGColor: newViewProps.borderColors.all.value()].CGColor;
//        }
//        self.panel.contentView.layer.borderColor = borderColor;
//    }


//    if (oldViewProps.backgroundColor != newViewProps.backgroundColor) {
//       self.panel.contentView.layer.backgroundColor = [NSColor colorWithCGColor:newViewProps.backgroundColor.CGColor].CGColor;
//    }

    [super updateProps:props oldProps:oldProps];
}

#pragma mark - Target View Lookup

// Find a view by its reactTag in the view hierarchy
- (NSView *)findViewWithReactTag:(NSNumber *)targetTag inView:(NSView *)view
{
    if ([view respondsToSelector:@selector(reactTag)]) {
        NSNumber *viewTag = [(id)view reactTag];
        if ([viewTag isEqualToNumber:targetTag]) {
            return view;
        }
    }

    for (NSView *subview in view.subviews) {
        NSView *found = [self findViewWithReactTag:targetTag inView:subview];
        if (found) return found;
    }

    return nil;
}

// Update callout position based on target view
- (void)updateWindowPositionFromTarget:(NSInteger)targetTag
{
    if (!self.window) return;

    // Find the target view in the window's content view hierarchy
    NSView *targetView = [self findViewWithReactTag:@(targetTag) inView:self.window.contentView];

    if (!targetView) {
        DevLog(@"[Callout] Could not find target view with tag: %ld", (long)targetTag);
        return;
    }

    // Get the target view's frame in window coordinates
    NSRect targetFrameInWindow = [targetView convertRect:targetView.bounds toView:nil];

    DevLog(@"[Callout] Target view found, frame in window: %@", NSStringFromRect(targetFrameInWindow));

    // Create anchor rect from target view's measured position
    // Use the target frame directly (already in window coordinates, origin at bottom-left for macOS)
    NSRect mainWinFrame = self.window.contentView.frame;

    // The targetFrameInWindow is bottom-left origin (macOS native)
    // Convert to top-left origin (React Native convention) for consistency with anchorRect
    CGFloat topLeftY = mainWinFrame.size.height - targetFrameInWindow.origin.y - targetFrameInWindow.size.height;

    // Create a temporary anchor rect struct
    FRNCalloutAnchorRectStruct anchorRect;
    anchorRect.screenX = targetFrameInWindow.origin.x;
    anchorRect.screenY = topLeftY;
    anchorRect.width = targetFrameInWindow.size.width;
    anchorRect.height = targetFrameInWindow.size.height;

    DevLog(@"[Callout] Computed anchorRect from target: x=%f, y=%f, w=%f, h=%f",
           anchorRect.screenX, anchorRect.screenY, anchorRect.width, anchorRect.height);

    [self updateWindowPosition:anchorRect];
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    RCTFRNCalloutHandleCommand(self, commandName, args);
}

- (void)updateLayoutMetrics:(LayoutMetrics const &)layoutMetrics
           oldLayoutMetrics:(LayoutMetrics const &)oldLayoutMetrics
{
    // Pass zero-sized metrics to super to hide the main view in the original hierarchy
    LayoutMetrics hiddenMetrics = layoutMetrics;
    hiddenMetrics.frame.size.width = 0;
    hiddenMetrics.frame.size.height = 0;

    [super updateLayoutMetrics:hiddenMetrics oldLayoutMetrics:oldLayoutMetrics];

    DevLog(@"[Callout] updateLayoutMetrics: Width=%f, Height=%f",
          layoutMetrics.frame.size.width,
          layoutMetrics.frame.size.height);

    // Synchronize panel frame size with React Native layout metrics
    NSRect panelFrame = self.panel.frame;
    panelFrame.size = NSMakeSize(layoutMetrics.frame.size.width, layoutMetrics.frame.size.height);
    [self.panel setFrame:panelFrame display:YES];

    // Also update proxyView to match
    [self.proxyView setFrameSize:panelFrame.size];
}
- (void)updateWindowRadius:(CascadedBorderRadii const &)Radii{
  CGFloat radius = 0.0;
  // Check if values exist (using logic similar to ViewProps)
  if (Radii.topLeft.has_value()) {
      radius = (CGFloat)Radii.topLeft.value().value;
  } else if (Radii.all.has_value()) {
      radius = (CGFloat)Radii.all.value().value;
  }
  self.panel.contentView.layer.cornerRadius = radius;
  self.panel.contentView.layer.masksToBounds = radius > 0;
}
- (void)updateWindowPosition:(FRNCalloutAnchorRectStruct const &)anchorRect
{
    if (anchorRect.width == 0 && anchorRect.height == 0) return;

    // Convert Fabric struct to NSRect
    NSRect anchorScreenRect = NSMakeRect(anchorRect.screenX, anchorRect.screenY, anchorRect.width, anchorRect.height);

    NSRect calloutFrame = [self bestCalloutRect:anchorScreenRect];

    DevLog(@"[Callout] final Window position: %@", NSStringFromRect(calloutFrame));
    [self.panel setFrame:calloutFrame display:YES];
    [self.panel makeKeyAndOrderFront:nil]; // Make Key to enable Light Dismiss (resignKey) behavior
}

- (NSRect)bestCalloutRect:(NSRect)anchorScreenRect
{
    FRNCalloutWindow *panel = self.panel;
    NSRect calloutFrame = panel.frame;
    //const auto &props = *std::static_pointer_cast<CalloutProps const>(_props);

    //transfer top-left related(relate to main window) coordinate to system bottom-left coordinate
    // Bug explanation: When using NSWindowStyleMaskFullSizeContentView (hidden title bar) and ScrollView as root,
    // NSScrollView.automaticallyAdjustsContentInsets (default YES) adds contentInset.top to push content below the toolbar.
    // However, React Native's measureInWindow (in DOM.cpp) calculates position relative to the React root shadow node,
    // which doesn't know about native contentInset adjustments. This causes a mismatch between visual position and
    // measured position (typically ~32px difference).
    // Fix applied in: node_modules/react-native-macos/React/Fabric/Mounting/ComponentViews/ScrollView/RCTEnhancedScrollView.mm
    // Added in initWithFrame: self.automaticallyAdjustsContentInsets = NO; for macOS (similar to iOS's contentInsetAdjustmentBehavior)
    //NSRect mainWinFrame =  self.window.frame;
    //NSRect mainWinFrame =  self.window.contentView.frame;
    NSRect mainWinFrame = NSMakeRect(self.window.frame.origin.x, self.window.frame.origin.y, self.window.contentView.frame.size.width, self.window.contentView.frame.size.height);
    //bottom-left related coordinate for anchorScreenRect
    anchorScreenRect.origin.y = mainWinFrame.size.height - (anchorScreenRect.origin.y + anchorScreenRect.size.height);

    //bottom-left system coordinate for calloutScreenRect
    NSRect calloutScreenRect = NSMakeRect(mainWinFrame.origin.x + anchorScreenRect.origin.x, mainWinFrame.origin.y+ anchorScreenRect.origin.y - self.panel.frame.size.height, calloutFrame.size.width, calloutFrame.size.height);


    // Edge collision detection and adjustment (Simplified implementation of Swift logic)
    NSRect screenFrame = [[NSScreen mainScreen] visibleFrame];
    // 1. Bottom collision (maxY case) -> Flip to top
    if (NSMinY(calloutScreenRect) < NSMinY(screenFrame)) {
        // Check if there is space above
      CGFloat maxAnchorY = mainWinFrame.origin.y+ anchorScreenRect.origin.y+anchorScreenRect.size.height;
        CGFloat topSpace = NSMaxY(screenFrame) - maxAnchorY;
        CGFloat bottomSpace = (mainWinFrame.origin.y+anchorScreenRect.origin.y);

        if (topSpace > bottomSpace) {
             calloutScreenRect.origin.y = maxAnchorY;
        } else {
             // Slide up
             calloutScreenRect.origin.y = NSMinY(screenFrame);
        }
    }

    // 2. Right collision -> Slide left
    if (NSMaxX(calloutScreenRect) > NSMaxX(screenFrame)) {
        calloutScreenRect.origin.x = NSMaxX(screenFrame) - NSWidth(calloutScreenRect);
    }

    // 3. Left collision -> Slide right
    if (NSMinX(calloutScreenRect) < NSMinX(screenFrame)) {
        calloutScreenRect.origin.x = NSMinX(screenFrame);
    }

    return calloutScreenRect;
}

- (void)windowDidResignKey:(NSNotification *)notification
{
    if (_eventEmitter) {
        // Check if focus went to another Callout window
        // - Parent → Child (submenu opens): Don't dismiss parent
        // - Child → Parent (focus returns): Should dismiss child
        NSWindow *keyWindow = [NSApp keyWindow];

        // Check if the new key window is also a FRNCalloutWindow
        if (keyWindow && [keyWindow isKindOfClass:[FRNCalloutWindow class]]) {
            // Compare window levels to determine parent/child relationship
            // Child windows (submenus) typically have higher level or were ordered above
            // If the new key window's level is >= our panel's level, it's likely a child (submenu)
            // So we shouldn't dismiss - we're the parent
            if ([keyWindow level] >= [self.panel level]) {
                DevLog(@"[Callout] windowDidResignKey: focus went to child Callout, not dismissing");
                return;
            }
            // Otherwise, we're the child going back to parent - should dismiss
            DevLog(@"[Callout] windowDidResignKey: focus returned to parent Callout, dismissing");
        }

        DevLog(@"[Callout] windowDidResignKey called");
        // Emit onDismiss event
        std::static_pointer_cast<FRNCalloutEventEmitter const>(_eventEmitter)->onDismiss(FRNCalloutEventEmitter::OnDismiss{});
    }
}

- (void)focusWindow
{
    [self.panel makeKeyAndOrderFront:nil];
    DevLog(@"[Callout] focusWindow called");
}

- (void)blurWindow
{
    DevLog(@"[Callout] blurWindow called");
    if (self.window) {
        [self.window makeKeyAndOrderFront:nil];
    }
}

- (void)showCallout
{
  if (!_panel && !self.window) return;

  // Ensure panel is created and parented
    FRNCalloutWindow *panel = self.panel;
  if (![panel parentWindow] && self.window) {
    [self.window addChildWindow:panel ordered:NSWindowAbove];
  }

  const auto &props = *std::static_pointer_cast<FRNCalloutProps const>(_props);

  // Use target if set, otherwise fall back to anchorRect
  if (_pendingTarget != 0) {
    DevLog(@"[Callout] showCallout: using pending target %ld", (long)_pendingTarget);
    [self updateWindowPositionFromTarget:_pendingTarget];
  } else {
    [self updateWindowPosition:props.anchorRect];
  }
  [self updateWindowRadius:props.borderRadii];
}

- (void)dismissCallout
{
  if (_panel) {
    [_panel.parentWindow removeChildWindow:_panel];
    [_panel orderOut:nil];
  }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    if (_panel) {
        [_panel.parentWindow removeChildWindow:_panel];
        [_panel orderOut:nil];
        _panel = nil;
    }
    [_touchHandler detachFromView:(RCTUIView *)_proxyView];
    _proxyView = nil;
    _touchHandler = nil;
}

Class<RCTComponentViewProtocol> FRNCalloutCls(void)
{
    return FRNCallout.class;
}

@end
#endif

