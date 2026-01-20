#ifndef SysIconNativeComponent_h
#define SysIconNativeComponent_h

#import <TargetConditionals.h>

#if TARGET_OS_OSX
#import <AppKit/AppKit.h>
#else
#import <UIKit/UIKit.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface SysIcon : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#else
#import <React/RCTViewManager.h>

@interface SysIconManager : RCTViewManager
@end
#endif

#endif /* SysIconNativeComponent_h */
