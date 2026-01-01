#import <React/RCTViewComponentView.h>
#import <TargetConditionals.h>
#if TARGET_OS_OSX
#import <AppKit/AppKit.h>
#else
#import <UIKit/UIKit.h>
#endif

#ifndef HoverableViewNativeComponent_h
#define HoverableViewNativeComponent_h

NS_ASSUME_NONNULL_BEGIN

@interface HoverableView : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#endif /* HoverableViewNativeComponent_h */
