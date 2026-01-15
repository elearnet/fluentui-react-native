#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
  self.moduleName = @"el_tester";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  self.dependencyProvider = [RCTAppDependencyProvider new];

  [super applicationDidFinishLaunching:notification];


  //hide the title bar, keep the toolbar area
  self.window.titlebarAppearsTransparent = YES;
  self.window.titleVisibility = NSWindowTitleHidden;
  //make sure the root view expands into the toolbar area
  self.window.styleMask |= NSWindowStyleMaskFullSizeContentView;
  //tool bar style: unifiedCompact
  if (@available(macOS 11.0, *)) {
    self.window.toolbarStyle = NSWindowToolbarStyleUnifiedCompact;
  }


  // Optional: Create a native NSToolbar for traffic light positioning
  NSToolbar *toolbar = [[NSToolbar alloc] initWithIdentifier:@"MainToolbar"];
  toolbar.showsBaselineSeparator = NO;
  self.window.toolbar = toolbar;

  // Add NSVisualEffectView for the native macOS background blur/vibrancy
  NSVisualEffectView *visualEffectView = [[NSVisualEffectView alloc] initWithFrame:self.window.contentView.bounds];
  visualEffectView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
  visualEffectView.blendingMode = NSVisualEffectBlendingModeBehindWindow;
  visualEffectView.material = NSVisualEffectMaterialSidebar; // or NSVisualEffectMaterialHeaderView for toolbar area
  visualEffectView.state = NSVisualEffectStateFollowsWindowActiveState;
  // Insert it behind all other views
  [self.window.contentView addSubview:visualEffectView positioned:NSWindowBelow relativeTo:nil];


}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
#ifdef RN_FABRIC_ENABLED
  return true;
#else
  return false;
#endif
}

@end
