#import <React/RCTViewComponentView.h>
#import <AppKit/AppKit.h>
#ifndef FocusZoneNativeComponent_h
#define FocusZoneNativeComponent_h

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, FocusZoneDirection) {
    FocusZoneDirectionBidirectional,
    FocusZoneDirectionHorizontal,
    FocusZoneDirectionVertical,
    FocusZoneDirectionNone
};

@interface FocusZone : RCTViewComponentView

@property(nonatomic) BOOL disabled;
@property(nonatomic) BOOL navigationOrderInRenderOrder;
@property(nonatomic) FocusZoneDirection focusZoneDirection;
@property(nonatomic) NSString *navigateAtEnd;
@property(nonatomic) NSString *tabKeyNavigation;
@property(nonatomic) NSView *defaultResponder;

@end

NS_ASSUME_NONNULL_END

#endif /* FocusZoneNativeComponent_h */
