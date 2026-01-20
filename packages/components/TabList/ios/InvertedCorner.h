#ifndef InvertedCornerNativeComponent_h
#define InvertedCornerNativeComponent_h

#import <TargetConditionals.h>

#if TARGET_OS_OSX
#import <AppKit/AppKit.h>
#else
#import <UIKit/UIKit.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface InvertedCorner : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#else
#import <React/RCTViewManager.h>

@interface InvertedCornerManager : RCTViewManager
@end
#endif

#endif /* InvertedCornerNativeComponent_h */
