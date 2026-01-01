#import <React/RCTViewComponentView.h>
#import <TargetConditionals.h>
#if TARGET_OS_OSX
#import <AppKit/AppKit.h>
#else
#import <UIKit/UIKit.h>
#endif

#ifndef SysIconNativeComponent_h
#define SysIconNativeComponent_h

NS_ASSUME_NONNULL_BEGIN

@interface SysIcon : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#endif /* SysIconNativeComponent_h */
