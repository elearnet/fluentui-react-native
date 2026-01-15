#import "RCTFocusZone.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/RCTFocusZoneSpec/ComponentDescriptors.h>
#import <react/renderer/components/RCTFocusZoneSpec/EventEmitters.h>
#import <react/renderer/components/RCTFocusZoneSpec/Props.h>
#import <react/renderer/components/RCTFocusZoneSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

// Import shared utilities from React
#import <React/RCTI18nUtil.h>

using namespace facebook::react;

// ============================================================================
// Types and Constants (from legacy RCTFocusZone.m)
// ============================================================================

typedef NS_ENUM(NSInteger, FocusZoneDirection) {
    FocusZoneDirectionBidirectional,
    FocusZoneDirectionHorizontal,
    FocusZoneDirectionVertical,
    FocusZoneDirectionNone
};

typedef enum {
    FocusZoneActionNone,
    FocusZoneActionTab,
    FocusZoneActionShiftTab,
    FocusZoneActionRightArrow,
    FocusZoneActionLeftArrow,
    FocusZoneActionDownArrow,
    FocusZoneActionUpArrow,
} FocusZoneAction;

typedef BOOL (^IsViewLeadingCandidateForNextFocus)(NSView *candidateView);

// Maximum vertical (or horizontal) displacement for a candidate view to be
// enumerated in the same row (or column) as the current focused view
static const CGFloat FocusZoneBuffer = 3;

// ============================================================================
// Utility Functions (from legacy RCTFocusZone.m)
// ============================================================================

static inline CGFloat GetDistanceBetweenPoints(NSPoint point1, NSPoint point2)
{
    NSPoint delta = NSMakePoint(point1.x - point2.x, point1.y - point2.y);
    return sqrt(delta.x * delta.x + delta.y * delta.y);
}

static inline CGFloat GetDistanceBetweenRects(NSRect rect1, NSRect rect2)
{
    bool isRTL = [[RCTI18nUtil sharedInstance] isRTL];

    CGFloat rect1Offset = isRTL ? rect1.size.width : 0;
    CGFloat rect2Offset = isRTL ? rect2.size.width : 0;

    NSPoint rect1Corner = NSMakePoint(rect1.origin.x + rect1Offset, rect1.origin.y);
    NSPoint rect2Corner = NSMakePoint(rect2.origin.x + rect2Offset, rect2.origin.y);

    return GetDistanceBetweenPoints(rect1Corner, rect2Corner);
}

static inline CGFloat GetMinDistanceBetweenRectVerticesAndPoint(NSRect rect, NSPoint point)
{
    return fmin(
        fmin(GetDistanceBetweenPoints(point, NSMakePoint(NSMinX(rect), NSMinY(rect))),
             GetDistanceBetweenPoints(point, NSMakePoint(NSMaxX(rect), NSMaxY(rect)))),
        fmin(GetDistanceBetweenPoints(point, NSMakePoint(NSMaxX(rect), NSMinY(rect))),
             GetDistanceBetweenPoints(point, NSMakePoint(NSMinX(rect), NSMaxY(rect))))
    );
}

static NSView *GetFirstFocusableViewWithin(NSView *parentView)
{
    if ([[parentView subviews] count] < 1) {
        return nil;
    }

    for (NSView *view in [parentView subviews]) {
        if ([view acceptsFirstResponder]) {
            return view;
        }

        NSView *match = GetFirstFocusableViewWithin(view);
        if (match) {
            return match;
        }
    }
    return nil;
}

static NSView *GetLastFocusableViewWithin(NSView *parentView)
{
    for (NSView *view in [[parentView subviews] reverseObjectEnumerator]) {
        if ([view acceptsFirstResponder]) {
            return view;
        }

        NSView *match = GetLastFocusableViewWithin(view);
        if (match) {
            return match;
        }
    }
    return nil;
}

static NSView *GetFirstResponder(NSWindow *window)
{
    NSResponder *responder = [window firstResponder];
    while (responder != nil && ![responder isKindOfClass:[NSView class]]) {
        responder = [responder nextResponder];
    }
    return [responder isKindOfClass:[NSView class]] ? (NSView *)responder : nil;
}

static FocusZoneAction GetActionForEvent(NSEvent *event)
{
    FocusZoneAction action = FocusZoneActionNone;

    NSEventModifierFlags modifierFlags = [event modifierFlags]
        & (NSEventModifierFlagShift | NSEventModifierFlagControl
           | NSEventModifierFlagOption | NSEventModifierFlagCommand);

    switch ([event keyCode]) {
        case 126: // kVK_UpArrow
            action = FocusZoneActionUpArrow;
            break;

        case 125: // kVK_DownArrow
            action = FocusZoneActionDownArrow;
            break;

        case 123: // kVK_LeftArrow
            action = FocusZoneActionLeftArrow;
            break;

        case 124: // kVK_RightArrow
            action = FocusZoneActionRightArrow;
            break;

        case 48: // kVK_Tab
            if (modifierFlags == 0) {
                action = FocusZoneActionTab;
            } else if (modifierFlags == NSEventModifierFlagShift) {
                action = FocusZoneActionShiftTab;
            }
            break;
    }

    return action;
}

static inline BOOL IsAdvanceWithinZoneAction(FocusZoneAction action)
{
    return action == FocusZoneActionRightArrow || action == FocusZoneActionDownArrow;
}

static inline BOOL IsHorizontalNavigationWithinZoneAction(FocusZoneAction action)
{
    return action == FocusZoneActionRightArrow || action == FocusZoneActionLeftArrow;
}

static RCTFocusZone *GetFocusZoneAncestor(NSView *view);

static BOOL ShouldSkipFocusZone(NSView *view)
{
    if ([view isKindOfClass:[RCTFocusZone class]]) {
        NSView *keyView = GetFirstFocusableViewWithin(view);
        if (keyView == nil) {
            return YES;
        }
    }
    return NO;
}

// ============================================================================
// RCTFocusZone Implementation
// ============================================================================

@implementation RCTFocusZone {
    BOOL _disabled;
    FocusZoneDirection _focusZoneDirection;
    NSString *_navigateAtEnd;
    NSString *_tabKeyNavigation;
    NSView *_defaultResponder;
}

+ (void)load
{
    NSLog(@"[FocusZone] +load: RCTFocusZone class loaded! self=%@", self);

    // Verify NSClassFromString can find us
    Class foundClass = NSClassFromString(@"RCTFocusZone");
    NSLog(@"[FocusZone] +load: NSClassFromString(@\"RCTFocusZone\") = %@, matches self: %d",
          foundClass, foundClass == self);
}

+ (void)initialize
{
    if (self == [RCTFocusZone class]) {
        NSLog(@"[FocusZone] +initialize: RCTFocusZone class initialized!");
    }
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    NSLog(@"[FocusZone] componentDescriptorProvider called!");
    return concreteComponentDescriptorProvider<RCTFocusZoneComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const RCTFocusZoneProps>();
        _props = defaultProps;
        _focusZoneDirection = FocusZoneDirectionBidirectional;
        _navigateAtEnd = @"NavigateStopAtEnds";
        _tabKeyNavigation = @"None";
        _disabled = NO;
        NSLog(@"[FocusZone] initWithFrame: created FocusZone instance");
    }
    return self;
}

- (void)viewDidMoveToWindow
{
    [super viewDidMoveToWindow];
    NSLog(@"[FocusZone] viewDidMoveToWindow: window=%@, subviews=%lu",
          self.window, (unsigned long)[[self subviews] count]);
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<RCTFocusZoneProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RCTFocusZoneProps const>(props);

    // Update disabled
    _disabled = newViewProps.disabled;

    // Update focusZoneDirection
    if (newViewProps.focusZoneDirection == RCTFocusZoneFocusZoneDirection::Bidirectional) {
        _focusZoneDirection = FocusZoneDirectionBidirectional;
    } else if (newViewProps.focusZoneDirection == RCTFocusZoneFocusZoneDirection::Vertical) {
        _focusZoneDirection = FocusZoneDirectionVertical;
    } else if (newViewProps.focusZoneDirection == RCTFocusZoneFocusZoneDirection::Horizontal) {
        _focusZoneDirection = FocusZoneDirectionHorizontal;
    } else if (newViewProps.focusZoneDirection == RCTFocusZoneFocusZoneDirection::None) {
        _focusZoneDirection = FocusZoneDirectionNone;
    }

    // Update navigateAtEnd
    if (newViewProps.navigateAtEnd == RCTFocusZoneNavigateAtEnd::NavigateStopAtEnds) {
        _navigateAtEnd = @"NavigateStopAtEnds";
    } else if (newViewProps.navigateAtEnd == RCTFocusZoneNavigateAtEnd::NavigateWrap) {
        _navigateAtEnd = @"NavigateWrap";
    } else if (newViewProps.navigateAtEnd == RCTFocusZoneNavigateAtEnd::NavigateContinue) {
        _navigateAtEnd = @"NavigateContinue";
    }

    // Update tabKeyNavigation
    if (newViewProps.tabKeyNavigation == RCTFocusZoneTabKeyNavigation::None) {
        _tabKeyNavigation = @"None";
    } else if (newViewProps.tabKeyNavigation == RCTFocusZoneTabKeyNavigation::NavigateWrap) {
        _tabKeyNavigation = @"NavigateWrap";
    } else if (newViewProps.tabKeyNavigation == RCTFocusZoneTabKeyNavigation::NavigateStopAtEnds) {
        _tabKeyNavigation = @"NavigateStopAtEnds";
    } else if (newViewProps.tabKeyNavigation == RCTFocusZoneTabKeyNavigation::Normal) {
        _tabKeyNavigation = @"Normal";
    }

    [super updateProps:props oldProps:oldProps];
}

- (BOOL)isFlipped
{
    return YES;
}

- (BOOL)acceptsFirstResponder
{
    BOOL shouldSkip = ShouldSkipFocusZone(self);
    BOOL result = !_disabled && !shouldSkip;
    NSLog(@"[FocusZone] acceptsFirstResponder: disabled=%d, shouldSkip=%d, result=%d, subviews=%lu",
          _disabled, shouldSkip, result, (unsigned long)[[self subviews] count]);
    return result;
}

- (BOOL)becomeFirstResponder
{
    NSView *keyView = _defaultResponder ?: GetFirstFocusableViewWithin(self);
    NSLog(@"[FocusZone] becomeFirstResponder: keyView=%@, disabled=%d", keyView, _disabled);
    return !_disabled && [[self window] makeFirstResponder:keyView];
}

// ============================================================================
// Focus Navigation Logic (adapted from legacy RCTFocusZone.m)
// ============================================================================

- (NSView *)nextViewToFocusForCondition:(IsViewLeadingCandidateForNextFocus)isLeadingCandidate
{
    NSView *nextViewToFocus = nil;
    NSMutableArray<NSView *> *queue = [NSMutableArray array];
    [queue addObject:self];

    while ([queue count] > 0) {
        NSView *candidateView = [queue firstObject];
        [queue removeObjectAtIndex:0];

        if ([candidateView isNotEqualTo:self] && [candidateView acceptsFirstResponder] && isLeadingCandidate(candidateView)) {
            nextViewToFocus = candidateView;
        }
        [queue addObjectsFromArray:[candidateView subviews]];
    }

    return nextViewToFocus;
}

- (NSView *)nextViewToFocusForAction:(FocusZoneAction)action
{
    BOOL isAdvance = IsAdvanceWithinZoneAction(action);
    BOOL isHorizontal = IsHorizontalNavigationWithinZoneAction(action);

    NSView *firstResponder = GetFirstResponder([self window]);
    NSRect firstResponderRect = [firstResponder convertRect:[firstResponder bounds] toView:self];
    NSScrollView *firstResponderEnclosingScrollView = [firstResponder enclosingScrollView];

    __block CGFloat closestDistance = CGFLOAT_MAX;
    __block CGFloat closestDistanceWithinEnclosingScrollView = CGFLOAT_MAX;

    IsViewLeadingCandidateForNextFocus block = ^BOOL(NSView *candidateView) {
        BOOL isLeadingCandidate = NO;
        BOOL skip = candidateView == firstResponder;
        NSRect candidateRect = [candidateView convertRect:[candidateView bounds] toView:self];
        BOOL subviewRelationExists = [candidateView isDescendantOf:firstResponder] || [firstResponder isDescendantOf:candidateView];

        if (isHorizontal) {
            if (subviewRelationExists) {
                skip = skip
                    || (isAdvance && NSMinX(candidateRect) < NSMinX(firstResponderRect))
                    || (!isAdvance && NSMaxX(candidateRect) > NSMaxX(firstResponderRect))
                    || NSMinY(candidateRect) > NSMaxY(firstResponderRect) - FocusZoneBuffer
                    || NSMaxY(candidateRect) < NSMinY(firstResponderRect) + FocusZoneBuffer;
            } else {
                skip = skip
                    || (isAdvance && NSMidX(candidateRect) < NSMidX(firstResponderRect))
                    || (!isAdvance && NSMidX(candidateRect) > NSMidX(firstResponderRect))
                    || NSMinY(candidateRect) > NSMaxY(firstResponderRect) - FocusZoneBuffer
                    || NSMaxY(candidateRect) < NSMinY(firstResponderRect) + FocusZoneBuffer;
            }
        } else {
            if (subviewRelationExists) {
                skip = skip
                    || (isAdvance && NSMinY(candidateRect) < NSMinY(firstResponderRect))
                    || (!isAdvance && NSMaxY(candidateRect) > NSMaxY(firstResponderRect))
                    || NSMaxX(candidateRect) < NSMinX(firstResponderRect) + FocusZoneBuffer
                    || NSMinX(candidateRect) > NSMaxX(firstResponderRect) - FocusZoneBuffer;
            } else {
                skip = skip
                    || (isAdvance && NSMidY(candidateRect) < NSMidY(firstResponderRect))
                    || (!isAdvance && NSMidY(candidateRect) > NSMidY(firstResponderRect))
                    || NSMaxX(candidateRect) < NSMinX(firstResponderRect) + FocusZoneBuffer
                    || NSMinX(candidateRect) > NSMaxX(firstResponderRect) - FocusZoneBuffer;
            }
        }

        if (!skip) {
            CGFloat distance = GetDistanceBetweenRects(firstResponderRect, candidateRect);

            if ([firstResponderEnclosingScrollView isEqualTo:[candidateView enclosingScrollView]]) {
                if (closestDistanceWithinEnclosingScrollView > distance) {
                    closestDistanceWithinEnclosingScrollView = distance;
                    isLeadingCandidate = YES;
                }
            } else {
                if (closestDistance > distance) {
                    closestDistance = distance;
                    isLeadingCandidate = YES;
                }
            }
        }

        return isLeadingCandidate;
    };

    return [self nextViewToFocusForCondition:block];
}

- (NSView *)nextViewToFocusForCircularAction:(FocusZoneAction)action
{
    BOOL isAdvance = IsAdvanceWithinZoneAction(action);
    BOOL isHorizontal = IsHorizontalNavigationWithinZoneAction(action);

    NSView *firstResponder = GetFirstResponder([self window]);
    NSRect firstResponderRect = [firstResponder convertRect:[firstResponder bounds] toView:self];
    NSPoint anchorPoint = isHorizontal
        ? NSMakePoint(isAdvance ? 0 : [self bounds].size.width, NSMidY(firstResponderRect))
        : NSMakePoint(NSMidX(firstResponderRect), isAdvance ? 0 : [self bounds].size.height);

    __block CGFloat closestDistance = CGFLOAT_MAX;

    IsViewLeadingCandidateForNextFocus block = ^BOOL(NSView *candidateView) {
        BOOL isLeadingCandidate = NO;
        BOOL skip = NO;
        NSRect candidateRect = [candidateView convertRect:[candidateView bounds] toView:self];
        BOOL subviewRelationExists = [candidateView isDescendantOf:firstResponder] || [firstResponder isDescendantOf:candidateView];

        if (isHorizontal) {
            if (subviewRelationExists) {
                skip = (isAdvance && NSMinX(candidateRect) > NSMinX(firstResponderRect))
                    || (!isAdvance && NSMaxX(candidateRect) < NSMaxX(firstResponderRect));
            } else {
                skip = (isAdvance && NSMidX(candidateRect) > NSMidX(firstResponderRect))
                    || (!isAdvance && NSMidX(candidateRect) < NSMidX(firstResponderRect));
            }
        } else {
            if (subviewRelationExists) {
                skip = (isAdvance && NSMinY(candidateRect) > NSMinY(firstResponderRect))
                    || (!isAdvance && NSMaxY(candidateRect) < NSMaxY(firstResponderRect));
            } else {
                skip = (isAdvance && NSMidY(candidateRect) > NSMidY(firstResponderRect))
                    || (!isAdvance && NSMidY(candidateRect) < NSMidY(firstResponderRect));
            }
        }

        if (!skip) {
            NSPoint candidatePoint = isHorizontal
                ? NSMakePoint(isAdvance ? NSMinX(candidateRect) : NSMaxX(candidateRect), NSMidY(candidateRect))
                : NSMakePoint(NSMidX(candidateRect), isAdvance ? NSMinY(candidateRect) : NSMaxY(candidateRect));

            CGFloat distance = GetDistanceBetweenPoints(anchorPoint, candidatePoint);
            if (closestDistance > distance) {
                closestDistance = distance;
                isLeadingCandidate = YES;
            }
        }

        return isLeadingCandidate;
    };

    return [self nextViewToFocusForCondition:block];
}

- (NSView *)nextViewToFocusForHorizontalNavigation:(FocusZoneAction)action
{
    BOOL isAdvance = IsAdvanceWithinZoneAction(action);

    NSView *firstResponder = GetFirstResponder([self window]);
    NSRect firstResponderRect = [firstResponder convertRect:[firstResponder bounds] toView:self];

    __block CGFloat closestDistance = CGFLOAT_MAX;

    NSRect selfBounds = [self bounds];
    NSPoint targetPoint = isAdvance
        ? NSMakePoint(0, NSMaxY(firstResponderRect))
        : NSMakePoint(selfBounds.size.width, NSMinY(firstResponderRect));

    IsViewLeadingCandidateForNextFocus block = ^BOOL(NSView *candidateView) {
        BOOL isLeadingCandidate = NO;
        NSRect candidateRect = [candidateView convertRect:[candidateView bounds] toView:self];

        BOOL skip = candidateView == firstResponder
            || (isAdvance && NSMinY(candidateRect) < NSMaxY(firstResponderRect) - FocusZoneBuffer)
            || (!isAdvance && NSMaxY(candidateRect) > NSMinY(firstResponderRect) + FocusZoneBuffer);

        if (!skip) {
            CGFloat distance = GetMinDistanceBetweenRectVerticesAndPoint(candidateRect, targetPoint);
            if (closestDistance > distance) {
                closestDistance = distance;
                isLeadingCandidate = YES;
            }
        }

        return isLeadingCandidate;
    };

    return [self nextViewToFocusForCondition:block];
}

- (NSView *)nextViewToFocusWithFallback:(FocusZoneAction)action considerCircular:(BOOL)shouldTryCircular
{
    NSView *firstResponder = GetFirstResponder([self window]);
    if (self == firstResponder) {
        if (action == FocusZoneActionDownArrow) {
            return GetFirstFocusableViewWithin(self);
        } else if (action == FocusZoneActionUpArrow) {
            return GetLastFocusableViewWithin(self);
        }
    }

    BOOL isHorizontal = IsHorizontalNavigationWithinZoneAction(action);
    BOOL isAdvance = IsAdvanceWithinZoneAction(action);
    NSView *nextViewToFocus = [self nextViewToFocusForAction:action];

    if (nextViewToFocus == nil) {
        if (isHorizontal) {
            nextViewToFocus = [self nextViewToFocusForHorizontalNavigation:action];
        } else {
            FocusZoneAction horizontalAction = isAdvance ? FocusZoneActionRightArrow : FocusZoneActionLeftArrow;
            nextViewToFocus = [self nextViewToFocusWithFallback:horizontalAction considerCircular:NO];
        }
    }

    if (nextViewToFocus == nil && shouldTryCircular) {
        nextViewToFocus = [self nextViewToFocusForCircularAction:action];

        if (nextViewToFocus == firstResponder) {
            nextViewToFocus = isHorizontal
                ? [self nextViewToFocusForCircularAction:isAdvance ? FocusZoneActionDownArrow : FocusZoneActionUpArrow]
                : [self nextViewToFocusForCircularAction:isAdvance ? FocusZoneActionRightArrow : FocusZoneActionLeftArrow];
        }

        if (nextViewToFocus == firstResponder) {
            nextViewToFocus = nil;
        }
    }

    return nextViewToFocus;
}

- (NSView *)nextViewToFocusOutsideZone:(FocusZoneAction)action
{
    NSView *nextViewToFocus = nil;
    RCTFocusZone *focusZoneAncestor = GetFocusZoneAncestor(self);

    if (action == FocusZoneActionTab) {
        nextViewToFocus = [self nextValidKeyView];
        while ([nextViewToFocus isDescendantOf:focusZoneAncestor]) {
            if ([nextViewToFocus isEqual:focusZoneAncestor]) {
                nextViewToFocus = nil;
                break;
            }
            nextViewToFocus = [nextViewToFocus nextValidKeyView];
        }
    } else if (action == FocusZoneActionShiftTab) {
        nextViewToFocus = [self previousValidKeyView];
        while ([nextViewToFocus isDescendantOf:focusZoneAncestor]) {
            if ([nextViewToFocus isEqual:focusZoneAncestor]) {
                nextViewToFocus = nil;
                break;
            }
            nextViewToFocus = [nextViewToFocus previousValidKeyView];
        }

        focusZoneAncestor = GetFocusZoneAncestor(nextViewToFocus);
        NSView *ancestorKeyView = [focusZoneAncestor defaultResponder];
        if (ancestorKeyView != nil) {
            nextViewToFocus = ancestorKeyView;
        }
    }

    return nextViewToFocus;
}

- (NSView *)nextViewToFocusForTab:(FocusZoneAction)action
{
    [[self window] recalculateKeyViewLoop];

    if (![@"NavigateWrap" isEqual:_tabKeyNavigation] && ![@"NavigateStopAtEnds" isEqual:_tabKeyNavigation]
        && ![@"Normal" isEqual:_tabKeyNavigation]) {
        return [self nextViewToFocusOutsideZone:action];
    }

    BOOL forward = action != FocusZoneActionShiftTab;
    NSView *firstResponder = GetFirstResponder([self window]);
    NSView *nextViewToFocus = forward ? [firstResponder nextValidKeyView] : [firstResponder previousValidKeyView];

    if (nextViewToFocus == self) {
        nextViewToFocus = forward ? [nextViewToFocus nextValidKeyView] : [nextViewToFocus previousValidKeyView];
    }

    if ([@"Normal" isEqual:_tabKeyNavigation] || [nextViewToFocus isDescendantOf:self]) {
        return nextViewToFocus;
    }

    if ([@"NavigateStopAtEnds" isEqual:_tabKeyNavigation]) {
        return nil;
    }

    // Wrap around
    NSView *aView = firstResponder;
    while (aView != self && [aView isDescendantOf:self]) {
        nextViewToFocus = aView;
        aView = forward ? [aView previousValidKeyView] : [aView nextValidKeyView];
    }

    return nextViewToFocus != firstResponder ? nextViewToFocus : nil;
}

- (NSView *)defaultResponder
{
    return _defaultResponder;
}

// ============================================================================
// Key Event Handling
// ============================================================================

- (void)keyDown:(NSEvent *)event
{
    NSLog(@"[FocusZone] keyDown: keyCode=%hu, characters=%@", [event keyCode], [event characters]);

    FocusZoneAction action = GetActionForEvent(event);
    NSLog(@"[FocusZone] keyDown: action=%d, disabled=%d, direction=%ld", action, _disabled, (long)_focusZoneDirection);

    BOOL passthrough = NO;
    NSView *viewToFocus = nil;

    if (_disabled || action == FocusZoneActionNone) {
        NSLog(@"[FocusZone] keyDown: passthrough due to disabled or ActionNone");
        passthrough = YES;
    } else if (action == FocusZoneActionTab || action == FocusZoneActionShiftTab) {
        NSLog(@"[FocusZone] keyDown: handling Tab/ShiftTab");
        viewToFocus = [self nextViewToFocusForTab:action];
    } else if ((_focusZoneDirection == FocusZoneDirectionVertical
                && (action == FocusZoneActionRightArrow || action == FocusZoneActionLeftArrow))
               || (_focusZoneDirection == FocusZoneDirectionHorizontal
                   && (action == FocusZoneActionUpArrow || action == FocusZoneActionDownArrow))
               || (_focusZoneDirection == FocusZoneDirectionNone)) {
        NSLog(@"[FocusZone] keyDown: passthrough due to direction mismatch");
        passthrough = YES;
    } else {
        NSLog(@"[FocusZone] keyDown: handling arrow key navigation");
        viewToFocus = [self nextViewToFocusWithFallback:action considerCircular:[@"NavigateWrap" isEqual:_navigateAtEnd]];
    }

    NSLog(@"[FocusZone] keyDown: viewToFocus=%@, passthrough=%d", viewToFocus, passthrough);

    if (viewToFocus != nil) {
        [[self window] makeFirstResponder:viewToFocus];
        [viewToFocus scrollRectToVisible:[viewToFocus bounds]];
    } else if (passthrough) {
        [super keyDown:event];
    }
}

Class<RCTComponentViewProtocol> RCTFocusZoneCls(void)
{
    return RCTFocusZone.class;
}

@end

// ============================================================================
// Helper Function (defined after class to avoid forward declaration issues)
// ============================================================================

static RCTFocusZone *GetFocusZoneAncestor(NSView *view)
{
    NSView *candidateView = view;
    NSView *topLevelView = [[view window] contentView];
    RCTFocusZone *focusZoneAncestor = nil;
    while (candidateView != nil && candidateView != topLevelView) {
        if ([candidateView isKindOfClass:[RCTFocusZone class]]) {
            focusZoneAncestor = (RCTFocusZone *)candidateView;
        }
        candidateView = [candidateView superview];
    }
    return focusZoneAncestor;
}

#endif

