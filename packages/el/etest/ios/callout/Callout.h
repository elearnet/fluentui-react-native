#ifndef CalloutNativeComponent_h
#define CalloutNativeComponent_h

#import <AppKit/AppKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <react/renderer/components/ETESTSpec/RCTComponentViewHelpers.h>

NS_ASSUME_NONNULL_BEGIN

@interface Callout : RCTViewComponentView <RCTCalloutViewProtocol, NSWindowDelegate>
@end

NS_ASSUME_NONNULL_END
#endif

#endif /* CalloutNativeComponent_h */
