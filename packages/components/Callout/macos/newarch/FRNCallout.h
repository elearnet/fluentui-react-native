#ifndef FRNCalloutNativeComponent_h
#define FRNCalloutNativeComponent_h

#import <AppKit/AppKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <react/renderer/components/FRNCalloutSpec/RCTComponentViewHelpers.h>

NS_ASSUME_NONNULL_BEGIN

@interface FRNCallout : RCTViewComponentView <RCTFRNCalloutViewProtocol, NSWindowDelegate>
@end

NS_ASSUME_NONNULL_END
#endif

#endif /* FRNCalloutNativeComponent_h */
