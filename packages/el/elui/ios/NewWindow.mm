#import "NewWindow.h"
#import <RCTAppDelegate.h>
#import <RCTRootViewFactory.h>
#import <AppKit/AppKit.h>

@implementation NewWindow {
  NSMutableDictionary<NSString *, NSWindow *> *_windowRegistry;
}

RCT_EXPORT_MODULE()

- (instancetype)init {
  if (self = [super init]) {
    _windowRegistry = [NSMutableDictionary new];
  }
  return self;
}

- (void)open:(NSString *)rescType rescId:(NSString *)rescId title:(NSString *)title {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *key = [NSString stringWithFormat:@"%@:%@", rescType, rescId];

    // 1. Check if window exists
    NSWindow *existingWindow = self->_windowRegistry[key];
    if (existingWindow) {
      [existingWindow makeKeyAndOrderFront:nil];
      return;
    }

    // 2. Create Window
    NSRect contentRect = NSMakeRect(0, 0, 800, 500);
    NSWindowStyleMask styleMask = NSWindowStyleMaskTitled | NSWindowStyleMaskClosable | NSWindowStyleMaskMiniaturizable | NSWindowStyleMaskResizable;
    NSWindow *window = [[NSWindow alloc] initWithContentRect:contentRect
                                                   styleMask:styleMask
                                                     backing:NSBackingStoreBuffered
                                                       defer:NO];
    
    window.releasedWhenClosed = NO;
    
    window.title = title;
    //hide the title bar, keep the toolbar area
    window.titlebarAppearsTransparent = YES;
    window.titleVisibility = NSWindowTitleHidden;
    //make sure the root view expands into the toolbar area
    window.styleMask |= NSWindowStyleMaskFullSizeContentView;
    //tool bar style: unifiedCompact
    if (@available(macOS 11.0, *)) {
      window.toolbarStyle = NSWindowToolbarStyleUnifiedCompact;
    }
    NSToolbar *toolbar = [[NSToolbar alloc] initWithIdentifier:@"NewWindowToolbar"];
    toolbar.showsBaselineSeparator = NO;
    window.toolbar = toolbar;

    // Add NSVisualEffectView for the native macOS background blur/vibrancy
  NSVisualEffectView *visualEffectView = [[NSVisualEffectView alloc] initWithFrame:window.contentView.bounds];
  visualEffectView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
  visualEffectView.blendingMode = NSVisualEffectBlendingModeBehindWindow;
  visualEffectView.material = NSVisualEffectMaterialSidebar; // or NSVisualEffectMaterialHeaderView for toolbar area
  visualEffectView.state = NSVisualEffectStateFollowsWindowActiveState;
  // Insert it behind all other views
  [window.contentView addSubview:visualEffectView positioned:NSWindowBelow relativeTo:nil];

    // 3. Attach React Surface
    id<NSApplicationDelegate> delegate = [NSApp delegate];
    if ([delegate isKindOfClass:[RCTAppDelegate class]]) {
      RCTAppDelegate *appDelegate = (RCTAppDelegate *)delegate;
      NSDictionary *props = @{
        @"rescType": rescType,
        @"rescId": rescId
      };

      NSView *rootView = [appDelegate.rootViewFactory viewWithModuleName:@"NewWindow"
                                                      initialProperties:props];
      window.contentView = rootView;
      [window makeKeyAndOrderFront:nil];

      // Store reference
      self->_windowRegistry[key] = window;

      // Handle closing
      [[NSNotificationCenter defaultCenter] addObserverForName:NSWindowWillCloseNotification
                                                        object:window
                                                         queue:[NSOperationQueue mainQueue]
                                                    usingBlock:^(NSNotification * _Nonnull note) {
        [self->_windowRegistry removeObjectForKey:key];
      }];
    }
  });
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNewWindowSpecJSI>(params);
}
#endif

@end
