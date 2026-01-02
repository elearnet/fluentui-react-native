
#ifndef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#if __has_include(<etest/etest-Swift.h>)
#import <etest/etest-Swift.h>
#else
#import "etest-Swift.h"
#endif

@interface CompatibleNitroViewManager : RCTViewManager
@end

@implementation CompatibleNitroViewManager

RCT_EXPORT_MODULE()

#if __has_include(<UIKit/UIKit.h>)
- (UIView *)view {
  return [[LegacyCompatibleNitroView alloc] init];
}
#elif __has_include(<AppKit/AppKit.h>)
- (NSView *)view {
  return [[LegacyCompatibleNitroView alloc] init];
}
#endif

RCT_EXPORT_VIEW_PROPERTY(color, NSString)
RCT_EXPORT_VIEW_PROPERTY(startFrom, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(onTick, RCTDirectEventBlock)

RCT_EXPORT_METHOD(reset:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, NSView *> *viewRegistry) {
    NSView *view = viewRegistry[reactTag];
    if ([view isKindOfClass:[LegacyCompatibleNitroView class]]) {
      [(LegacyCompatibleNitroView *)view reset];
    }
  }];
}
@end

#endif


