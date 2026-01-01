#import <React/RCTViewComponentView.h>
#if __has_include(<UIKit/UIKit.h>)
#import <UIKit/UIKit.h>
#elif __has_include(<AppKit/AppKit.h>)
#import <AppKit/AppKit.h>
#endif
#ifndef InvertedCornerNativeComponent_h
#define InvertedCornerNativeComponent_h
NS_ASSUME_NONNULL_BEGIN
@interface InvertedCorner : RCTViewComponentView
@end
NS_ASSUME_NONNULL_END
#endif /* InvertedCornerNativeComponent_h */
