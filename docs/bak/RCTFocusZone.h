#ifndef RCTFocusZoneNativeComponent_h
#define RCTFocusZoneNativeComponent_h

#import <AppKit/AppKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <react/renderer/components/RCTFocusZoneSpec/RCTComponentViewHelpers.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTFocusZone : RCTViewComponentView <RCTRCTFocusZoneViewProtocol>
@end

NS_ASSUME_NONNULL_END
#endif

#endif /* RCTFocusZoneNativeComponent_h */
