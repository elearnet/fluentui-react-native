#ifndef CompatibleViewNativeComponent_h
#define CompatibleViewNativeComponent_h

#if __has_include(<UIKit/UIKit.h>)
#import <UIKit/UIKit.h>
#elif __has_include(<AppKit/AppKit.h>)
#import <AppKit/AppKit.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface CompatibleView : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#else
#import <React/RCTViewManager.h>

@interface CompatibleViewManager : RCTViewManager
@end
#endif

#endif /* CompatibleViewNativeComponent_h */
