#import <React/RCTViewComponentView.h>
#if __has_include(<UIKit/UIKit.h>)
#import <UIKit/UIKit.h>
#elif __has_include(<AppKit/AppKit.h>)
#import <AppKit/AppKit.h>
#endif
#ifndef FbrViewExampleNativeComponent_h
#define FbrViewExampleNativeComponent_h

NS_ASSUME_NONNULL_BEGIN

@interface FbrViewExample1 : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#endif /* FbrViewExampleNativeComponent_h */
