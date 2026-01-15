#import "FocusZone.h"

#import <react/renderer/components/FocusZoneSpec/ComponentDescriptors.h>
#import <react/renderer/components/FocusZoneSpec/EventEmitters.h>
#import <react/renderer/components/FocusZoneSpec/Props.h>
#import <react/renderer/components/FocusZoneSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

// Import shared utilities from React
#import <React/RCTI18nUtil.h>
#import <React/RCTTextInputComponentView.h>

/// Returns the topmost view of the given view's superview heirarchy that is a FocusZone.
/// Returns nil if no FocusZone is found.
static FocusZone *GetFocusZoneAncestor(NSView *view)
{
    NSView *candidateView = view;
    NSView *topLevelView = [[view window] contentView];
    FocusZone *focusZoneAncestor = nil;
    while (candidateView != nil && candidateView != topLevelView)
    {
        if ([candidateView isKindOfClass:[FocusZone class]])
        {
            focusZoneAncestor = (FocusZone *)candidateView;
        }
        candidateView = [candidateView superview];
    }
    return focusZoneAncestor;
}

// ============================================================================
// Category on RCTViewComponentView to enable focus for Fabric views
// In Fabric, focusable={true} doesn't make acceptsFirstResponder return YES.
// This category fixes that by returning YES when the view is an accessibility element.
// ============================================================================
@implementation RCTViewComponentView (FocusZoneFocusable)

- (BOOL)acceptsFirstResponder {
    // Views with accessible={true} (which Pressable with focusable sets)
    // should accept first responder for keyboard navigation
    return [self isAccessibilityElement];
//    if ([self isAccessibilityElement]) {
//        return YES;
//    }
//    return [super acceptsFirstResponder];
}

- (BOOL)becomeFirstResponder
{
    if (![super becomeFirstResponder]) {
        return NO;
    }

    // If we've gained focus, notify listeners
    //[_eventDispatcher sendEvent:[RCTFocusChangeEvent focusEventWithReactTag:self.reactTag]];
    //for test
    self.wantsLayer = YES;
    self.layer.borderWidth = 4.0;
    self.layer.borderColor = [[NSColor keyboardFocusIndicatorColor] CGColor];


    // Emit onFocus event to JavaScript
       // Access the protected _eventEmitter ivar
    if (_eventEmitter) {
        // ViewEventEmitter has dispatchEvent for generic events
        // no onFocus , use onAccessibilityAction instead for now.
        std::dynamic_pointer_cast<const facebook::react::ViewEventEmitter>(_eventEmitter)
                ->onAccessibilityAction("focus");
    }

    return YES;
}

- (BOOL)resignFirstResponder
{
  if (![super resignFirstResponder]) {
    return NO;
  }

  // If we've lost focus, notify listeners
  //[_eventDispatcher sendEvent:[RCTFocusChangeEvent blurEventWithReactTag:self.reactTag]];
    if (_eventEmitter) {
        std::dynamic_pointer_cast<const facebook::react::ViewEventEmitter>(_eventEmitter)
            ->onAccessibilityAction("blur");
    }
  //for test
  self.layer.borderWidth = 0;
  return YES;
}

//In Paper, key events bubble up the view hierarchy!
//In Fabric, RCTViewComponentView doesn't forward keyDown: to its parent
//so we need to forward it ourselves
//commented out, no effect it seems
/*
- (void)keyDown:(NSEvent *)event {
    // Forward to parent FocusZone
    FocusZone *focusZone = GetFocusZoneAncestor(self);
    if (focusZone) {
        [focusZone keyDown:event];
    } else {
        [super keyDown:event];
    }
}*/

@end

using namespace facebook::react;

// ============================================================================
// Types and Constants (from legacy RCTFocusZone.m)
// ============================================================================

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
// FocusZone Implementation
// ============================================================================

@interface FocusZone () <RCTFocusZoneViewProtocol>
@end

@implementation FocusZone {
}


+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<FocusZoneComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const FocusZoneProps>();
        _props = defaultProps;
        _disabled = NO;
        _navigationOrderInRenderOrder = NO;
        _focusZoneDirection = FocusZoneDirectionBidirectional;
        _navigateAtEnd = @"NavigateStopAtEnds";
        _tabKeyNavigation = @"None";

        /*
         @property(nonatomic) BOOL disabled;
         @property(nonatomic) BOOL navigationOrderInRenderOrder;
         @property(nonatomic) FocusZoneDirection focusZoneDirection;
         @property(nonatomic) NSString *navigateAtEnd;
         @property(nonatomic) NSString *tabKeyNavigation;
         @property(nonatomic) NSView *defaultResponder;
         */
        /*
         disabled?: boolean;
         navigateAtEnd
         defaultTabbableElement
         focusZoneDirection
         use2DNavigation
         tabKeyNavigation

         isTabNavigation?: boolean;
         */
        //NSLog(@"[FocusZone] initWithFrame: created FocusZone instance");
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    //const auto &oldViewProps = *std::static_pointer_cast<FocusZoneProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<FocusZoneProps const>(props);

    // Update disabled
    _disabled = newViewProps.disabled;
    // Update navigationOrderInRenderOrder
    _navigationOrderInRenderOrder = newViewProps.navigationOrderInRenderOrder;

    // Update focusZoneDirection
    if (newViewProps.focusZoneDirection == FocusZoneFocusZoneDirection::Bidirectional) {
        _focusZoneDirection = FocusZoneDirectionBidirectional;
    } else if (newViewProps.focusZoneDirection == FocusZoneFocusZoneDirection::Vertical) {
        _focusZoneDirection = FocusZoneDirectionVertical;
    } else if (newViewProps.focusZoneDirection == FocusZoneFocusZoneDirection::Horizontal) {
        _focusZoneDirection = FocusZoneDirectionHorizontal;
    } else if (newViewProps.focusZoneDirection == FocusZoneFocusZoneDirection::None) {
        _focusZoneDirection = FocusZoneDirectionNone;
    }

    // Update navigateAtEnd
    if (newViewProps.navigateAtEnd == FocusZoneNavigateAtEnd::NavigateStopAtEnds) {
        _navigateAtEnd = @"NavigateStopAtEnds";
    } else if (newViewProps.navigateAtEnd == FocusZoneNavigateAtEnd::NavigateWrap) {
        _navigateAtEnd = @"NavigateWrap";
    } else if (newViewProps.navigateAtEnd == FocusZoneNavigateAtEnd::NavigateContinue) {
        _navigateAtEnd = @"NavigateContinue";
    }

    // Update tabKeyNavigation
    if (newViewProps.tabKeyNavigation == FocusZoneTabKeyNavigation::None) {
        _tabKeyNavigation = @"None";
    } else if (newViewProps.tabKeyNavigation == FocusZoneTabKeyNavigation::NavigateWrap) {
        _tabKeyNavigation = @"NavigateWrap";
    } else if (newViewProps.tabKeyNavigation == FocusZoneTabKeyNavigation::NavigateStopAtEnds) {
        _tabKeyNavigation = @"NavigateStopAtEnds";
    } else if (newViewProps.tabKeyNavigation == FocusZoneTabKeyNavigation::Normal) {
        _tabKeyNavigation = @"Normal";
    }

    // Update defaultTabbableElement
    // Note: folly::dynamic::empty() throws on numeric types, so check isNull() first
    const auto &defaultTabbable = newViewProps.defaultTabbableElement;
    if (!defaultTabbable.isNull()) {
        if (defaultTabbable.isString()) {
            // Handle as nativeID
            const auto &str = defaultTabbable.getString();
            if (!str.empty()) {
                NSString *nativeID = [NSString stringWithUTF8String:str.c_str()];
                _defaultResponder = [self findViewWithNativeID:nativeID inView:self];
            }
        } else if (defaultTabbable.isNumber()) {
            // JS numbers come as double, not int
            // Handle as React tag (not supported in Fabric)
            NSLog(@"[FocusZone] Warning: Integer/number tag lookup not supported in Fabric. Use nativeID (string) instead.");
        }
    }
    [super updateProps:props oldProps:oldProps];
}


- (NSView *)findViewWithNativeID:(NSString *)nativeID inView:(NSView *)parentView
{
    for (NSView *subview in [parentView subviews]) {
        // Check if it's a Fabric view with nativeID property
//        if ([subview isKindOfClass:NSClassFromString(@"RCTViewComponentView")]) {
//            // Use valueForKey to access nativeID without direct cast
//            NSString *viewNativeID = [subview valueForKey:@"nativeID"];
//            if ([viewNativeID isEqualToString:nativeID]) {
//                return subview;
//            }
//        }
        if ([subview isKindOfClass:[RCTViewComponentView class]]) {
            NSString *viewNativeID = ((RCTViewComponentView *)subview).nativeId;
            if ([viewNativeID isEqualToString:nativeID]) {
                return subview;
            }
        }
        NSView *found = [self findViewWithNativeID:nativeID inView:subview];
        if (found) return found;
    }
    return nil;
}

Class<RCTComponentViewProtocol> FocusZoneCls(void)
{
    return FocusZone.class;
}

static inline CGFloat GetDistanceBetweenPoints(NSPoint point1, NSPoint point2)
{
    NSPoint delta = NSMakePoint(point1.x - point2.x, point1.y - point2.y);
    return sqrt(delta.x * delta.x + delta.y * delta.y);
}

static inline CGFloat GetDistanceBetweenRects(NSRect rect1, NSRect rect2)
{
    // Get the top left corner of the rect, top right in RTL
    bool isRTL = [[RCTI18nUtil sharedInstance] isRTL];

    CGFloat rect1Offset = isRTL ? rect1.size.width : 0;
    CGFloat rect2Offset = isRTL ? rect2.size.width : 0;

    NSPoint rect1Corner = NSMakePoint(rect1.origin.x + rect1Offset , rect1.origin.y);
    NSPoint rect2Corner = NSMakePoint(rect2.origin.x + rect2Offset , rect2.origin.y);

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

/// Performs a depth first search looking for the first view that accepts responder status in a parent view's view hierarchy.
/// Helper function to check if a view is focusable in Fabric
/// Checks both acceptsFirstResponder AND the focusable prop from ViewProps
//comment out : Category acceptsFirstResponder on RCTViewComponentView instead
//static BOOL IsFocusableView(NSView *view)
//{
//    // First, check standard acceptsFirstResponder
//    if ([view acceptsFirstResponder]) {
//        return YES;
//    }
//
//    // In Fabric, check the focusable prop from ViewProps
//    if ([view isKindOfClass:[RCTViewComponentView class]]) {
//         RCTViewComponentView *componentView = (RCTViewComponentView *)view;
//
//        // Access the _props protected ivar to check focusable
//        // ViewProps has a 'focusable' boolean field
//        @try {
//            // The props are stored as SharedViewProps (_props)
//            // We can check via accessibility - focusable views often have accessibility enabled
//            // For now, we'll use isAccessibilityElement as a proxy for focusable
//            // TODO: Properly access ViewProps.focusable when RN exposes it
//            //if ([view isAccessibilityElement]) {
//            if(componentView.isAccessibilityElement){
//                return YES;
//            }
//        } @catch (NSException *e) {
//            // Ignore
//        }
//    }
//
//    return NO;
//}

/// This function does not take into account the geometric position of the view.
static NSView *GetFirstFocusableViewWithin(NSView *parentView)
{
    if ([[parentView subviews] count] < 1) {
        return nil;
    }

    // Debug: Log parent view class and nativeID
    NSString *parentClassName = NSStringFromClass([parentView class]);
    NSString *parentNativeID = nil;
    if ([parentView isKindOfClass:[RCTViewComponentView class]]) {
        parentNativeID = ((RCTViewComponentView *)parentView).nativeId;
    }


    NSLog(@"[FocusZone] Searching in parent: class=%@, nativeID=%@, subviewCount=%lu",
          parentClassName,
          parentNativeID ?: @"(nil)",
          (unsigned long)[[parentView subviews] count]);

    for (NSView *view in [parentView subviews]) {
        // Get view info for debugging
        NSString *className = NSStringFromClass([view class]);
        NSString *nativeID = nil;

        // Safely get nativeID if the view responds to it
        if ([view isKindOfClass:[RCTViewComponentView class]]) {
            nativeID = ((RCTViewComponentView *)view).nativeId;
        }
//In Paper, when you set focusable={true} on a component, the view's acceptsFirstResponder returns YES.
//In Fabric, this connection is broken — the focusable prop doesn't automatically translate to acceptsFirstResponder returning YES.
        //if ([view acceptsFirstResponder]) {
        BOOL isFocusable =  [view acceptsFirstResponder];//IsFocusableView(view);
        NSLog(@"[FocusZone]   view: class=%@, nativeID=%@, isFocusable=%d",
              className, nativeID ?: @"(nil)", isFocusable);
        if(isFocusable){
            if ([view isKindOfClass:[RCTTextInputComponentView class]]) {
                NSView *backedTextInputView = [(RCTTextInputComponentView *)view accessibilityElement];
                if ([backedTextInputView acceptsFirstResponder]) {
                    NSLog(@"[FocusZone]   -> Found focusable TextInput: %@", nativeID);
                    return backedTextInputView;
                }
            } else {
                //NSLog(@"[FocusZone]   -> Found focusable view: class=%@, nativeID=%@", className, nativeID);
                return view;
            }
        }

        NSView *match = GetFirstFocusableViewWithin(view);
        if (match) {
            return match;
        }
    }
    return nil;
}
/// Performs a depth first search looking for the last that accepts responder status in a parent view's view hierarchy.
/// We find the last view by simply reversing the order of the subview array.
/// This function does not take into account the geometric position of the view.
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
    while (responder != nil && ![responder isKindOfClass:[NSView class]])
    {
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
//static FocusZoneAction GetActionForEvent(NSEvent *event)
//{
//    FocusZoneAction action = FocusZoneActionNone;
//
//    NSEventModifierFlags modifierFlags = [event modifierFlags]
//        & (NSEventModifierFlagShift | NSEventModifierFlagControl
//            | NSEventModifierFlagOption | NSEventModifierFlagCommand);
//
//    switch ([event keyCode])
//    {
//        case kVK_UpArrow:
//            action = FocusZoneActionUpArrow;
//            break;
//
//        case kVK_DownArrow:
//            action = FocusZoneActionDownArrow;
//            break;
//
//        case kVK_LeftArrow:
//            action = FocusZoneActionLeftArrow;
//            break;
//
//        case kVK_RightArrow:
//            action = FocusZoneActionRightArrow;
//            break;
//
//        case kVK_Tab:
//            if (modifierFlags == 0)
//            {
//                action = FocusZoneActionTab;
//                break;
//            }
//            else if (modifierFlags == NSEventModifierFlagShift)
//            {
//                action = FocusZoneActionShiftTab;
//                break;
//            }
//    }
//
//    return action;
//}

static inline BOOL IsAdvanceWithinZoneAction(FocusZoneAction action)
{
    return action == FocusZoneActionRightArrow || action == FocusZoneActionDownArrow;
}

static inline BOOL IsHorizontalNavigationWithinZoneAction(FocusZoneAction action)
{
    return action == FocusZoneActionRightArrow || action == FocusZoneActionLeftArrow;
}


/// Bypass FocusZone if it's empty or has no focusable elements
static BOOL ShouldSkipFocusZone(NSView *view)
{
    if([view isKindOfClass:[FocusZone class]])
    {
        NSView *keyView = GetFirstFocusableViewWithin(view);
        // FocusZone is empty or has no focusable elements
        if (keyView == nil)
        {
            return YES;
        }
    }

    return NO;
}

/// FocusZone bases its return to accessibilityChildrenInNavigationOrder on the navigationOrderInRenderOrder property.
/// If navigationOrderInRenderOrder is set to YES, the accessible children are returned in the same order as returned by [(NSView) accessibilityChildren].
/// If navigationOrderInRenderOrder is set to NO, the accessible children are returned in the order determined by [(NSView) accessibilityChildrenInNavigationOrder].
- (NSArray *)accessibilityChildrenInNavigationOrder {
    if ([self navigationOrderInRenderOrder]) {
        return [self accessibilityChildren];
    }

    return [super accessibilityChildrenInNavigationOrder];
}

/// Accept firstResponder on FocusZone itself in order to reassign it within the FocusZone.
- (BOOL)acceptsFirstResponder
{
    // Reject first responder if FocusZone is disabled or should be skipped.
    BOOL aa =  !ShouldSkipFocusZone(self);
    NSLog(@"acceptsFirstResponder,aa:%d",aa);
    return !_disabled && aa;
}

- (BOOL)becomeFirstResponder
{
    NSView *keyView = _defaultResponder ?: GetFirstFocusableViewWithin(self);
    if(!_disabled){
        BOOL aa =  [keyView acceptsFirstResponder];
        BOOL bb = [[self window] makeFirstResponder:keyView];
        NSString *nativeID = nil;
        // Safely get nativeID if the view responds to it
        if ([keyView isKindOfClass:[RCTViewComponentView class]]) {
            nativeID = ((RCTViewComponentView *)keyView).nativeId;
        }
        NSLog(@"becomeFirstResponder,acceptsFirstResponder:%d,makeFirstResponder:%d,nativeID:%@",aa,bb,nativeID ?: @"(nil)");
        return bb;
        //return YES;
    }
    return NO;
}

- (NSView *)nextViewToFocusForCondition:(IsViewLeadingCandidateForNextFocus)isLeadingCandidate
{
    NSView *nextViewToFocus;
    NSMutableArray<NSView *> *queue = [NSMutableArray array];
    [queue addObject:self];

    while ([queue count] > 0)
    {
        NSView *candidateView = [queue firstObject];
        [queue removeObjectAtIndex:0];

        if ([candidateView isNotEqualTo:self] && [candidateView acceptsFirstResponder] && isLeadingCandidate(candidateView))
        {
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
    NSScrollView * firstResponderEnclosingScrollView = [firstResponder enclosingScrollView];

    __block CGFloat closestDistance = CGFLOAT_MAX;
    __block CGFloat closestDistanceWithinEnclosingScrollView = CGFLOAT_MAX;

    IsViewLeadingCandidateForNextFocus block = ^BOOL(NSView *candidateView)
    {
        BOOL isLeadingCandidate = NO;
        BOOL skip = candidateView == firstResponder;
        NSRect candidateRect = [candidateView convertRect:[candidateView bounds] toView:self];
        BOOL subviewRelationExists = [candidateView isDescendantOf:firstResponder] || [firstResponder isDescendantOf:candidateView];

        if (isHorizontal)
        {
            if (subviewRelationExists)
            {
                skip = skip
                    || (isAdvance && NSMinX(candidateRect) < NSMinX(firstResponderRect))
                    || (!isAdvance && NSMaxX(candidateRect) > NSMaxX(firstResponderRect))
                    || NSMinY(candidateRect) > NSMaxY(firstResponderRect) - FocusZoneBuffer
                    || NSMaxY(candidateRect) < NSMinY(firstResponderRect) + FocusZoneBuffer;
            }
            else
            {
                skip = skip
                    || (isAdvance && NSMidX(candidateRect) < NSMidX(firstResponderRect))
                    || (!isAdvance && NSMidX(candidateRect) > NSMidX(firstResponderRect))
                    || NSMinY(candidateRect) > NSMaxY(firstResponderRect) - FocusZoneBuffer
                    || NSMaxY(candidateRect) < NSMinY(firstResponderRect) + FocusZoneBuffer;
            }
        }
        else
        {
            if (subviewRelationExists)
            {
                skip = skip
                    || (isAdvance && NSMinY(candidateRect) < NSMinY(firstResponderRect))
                    || (!isAdvance && NSMaxY(candidateRect) > NSMaxY(firstResponderRect))
                    || NSMaxX(candidateRect) < NSMinX(firstResponderRect) + FocusZoneBuffer
                    || NSMinX(candidateRect) > NSMaxX(firstResponderRect) - FocusZoneBuffer;
            }
            else
            {
                skip = skip
                    || (isAdvance && NSMidY(candidateRect) < NSMidY(firstResponderRect))
                    || (!isAdvance && NSMidY(candidateRect) > NSMidY(firstResponderRect))
                    || NSMaxX(candidateRect) < NSMinX(firstResponderRect) + FocusZoneBuffer
                    || NSMinX(candidateRect) > NSMaxX(firstResponderRect) - FocusZoneBuffer;
            }
        }

        if (!skip)
        {
            CGFloat distance = GetDistanceBetweenRects(firstResponderRect, candidateRect);

            // If there are other candidate views inside the same ScrollView as the firstResponder,
            // prefer those views over other views outside the scrollview, even if they are closer.
            if ([firstResponderEnclosingScrollView isEqualTo:[candidateView enclosingScrollView]])
            {
                if (closestDistanceWithinEnclosingScrollView > distance)
                {
                    closestDistanceWithinEnclosingScrollView = distance;
                    isLeadingCandidate = YES;
                }
            }
            else
            {
                if (closestDistance > distance)
                {
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

    IsViewLeadingCandidateForNextFocus block = ^BOOL(NSView *candidateView)
    {
        BOOL isLeadingCandidate = NO;
        BOOL skip = NO;
        NSRect candidateRect = [candidateView convertRect:[candidateView bounds] toView:self];
        BOOL subviewRelationExists = [candidateView isDescendantOf:firstResponder] || [firstResponder isDescendantOf:candidateView];

        if (isHorizontal)
        {
            if (subviewRelationExists)
            {
                skip = (isAdvance && NSMinX(candidateRect) > NSMinX(firstResponderRect))
                    || (!isAdvance && NSMaxX(candidateRect) < NSMaxX(firstResponderRect));
            }
            else
            {
                skip = (isAdvance && NSMidX(candidateRect) > NSMidX(firstResponderRect))
                    || (!isAdvance && NSMidX(candidateRect) < NSMidX(firstResponderRect));
            }
        }
        else
        {
            if (subviewRelationExists)
            {
                skip = (isAdvance && NSMinY(candidateRect) > NSMinY(firstResponderRect))
                    || (!isAdvance && NSMaxY(candidateRect) < NSMaxY(firstResponderRect));
            }
            else
            {
                skip = (isAdvance && NSMidY(candidateRect) > NSMidY(firstResponderRect))
                    || (!isAdvance && NSMidY(candidateRect) < NSMidY(firstResponderRect));
            }
        }

        if (!skip)
        {
            NSPoint candidatePoint = isHorizontal
                ? NSMakePoint(isAdvance ? NSMinX(candidateRect) : NSMaxX(candidateRect), NSMidY(candidateRect))
                : NSMakePoint(NSMidX(candidateRect), isAdvance ? NSMinY(candidateRect) : NSMaxY(candidateRect));

            CGFloat distance = GetDistanceBetweenPoints(anchorPoint, candidatePoint);
            if (closestDistance > distance)
            {
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

    IsViewLeadingCandidateForNextFocus block = ^BOOL(NSView *candidateView)
    {
        BOOL isLeadingCandidate = NO;
        NSRect candidateRect = [candidateView convertRect:[candidateView bounds] toView:self];

        BOOL skip = candidateView == firstResponder
            || (isAdvance && NSMinY(candidateRect) < NSMaxY(firstResponderRect) - FocusZoneBuffer)
            || (!isAdvance && NSMaxY(candidateRect) > NSMinY(firstResponderRect) + FocusZoneBuffer);

        if (!skip)
        {
            CGFloat distance = GetMinDistanceBetweenRectVerticesAndPoint(candidateRect, targetPoint);
            if (closestDistance > distance)
            {
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
    // Special case if we're currently focused on self
    NSView *firstResponder = GetFirstResponder([self window]);
    if (self == firstResponder)
    {
        if (action == FocusZoneActionDownArrow)
        {
            return GetFirstFocusableViewWithin(self);
        }
        else if (action == FocusZoneActionUpArrow)
        {
            return GetLastFocusableViewWithin(self);
        }
    }

    BOOL isHorizontal = IsHorizontalNavigationWithinZoneAction(action);
    BOOL isAdvance = IsAdvanceWithinZoneAction(action);
    NSView *nextViewToFocus = [self nextViewToFocusForAction:action];

    if (nextViewToFocus == nil)
    {
        if (isHorizontal)
        {
            nextViewToFocus = [self nextViewToFocusForHorizontalNavigation:action];
        }
        else
        {
            FocusZoneAction horizontalAction = isAdvance ? FocusZoneActionRightArrow : FocusZoneActionLeftArrow;
            nextViewToFocus = [self nextViewToFocusWithFallback:horizontalAction considerCircular:NO];
        }
    }

    if (nextViewToFocus == nil && shouldTryCircular)
    {
        nextViewToFocus = [self nextViewToFocusForCircularAction:action];

        if (nextViewToFocus == firstResponder)
        {
            nextViewToFocus = isHorizontal ?
                [self nextViewToFocusForCircularAction:isAdvance ? FocusZoneActionDownArrow : FocusZoneActionUpArrow] :
                [self nextViewToFocusForCircularAction:isAdvance ? FocusZoneActionRightArrow : FocusZoneActionLeftArrow];
        }

        if (nextViewToFocus == firstResponder)
        {
            nextViewToFocus = nil;
        }
    }

    return nextViewToFocus;
}

- (NSView *)nextViewToFocusOutsideZone:(FocusZoneAction)action
{
    NSLog(@"nextViewToFocusOutsideZone called");
    NSView *nextViewToFocus;

    // Find the first view outside the FocusZone (or any parent FocusZones) to place focus
    FocusZone *focusZoneAncestor = GetFocusZoneAncestor(self);

    if (action == FocusZoneActionTab)  // Advance to next zone
    {
        nextViewToFocus = [self nextValidKeyView];
        while([nextViewToFocus isDescendantOf:focusZoneAncestor])
        {
            // there are no views left in the key view loop
            if ([nextViewToFocus isEqual:focusZoneAncestor])
            {
                nextViewToFocus = nil;
                break;
            }
            nextViewToFocus = [nextViewToFocus nextValidKeyView];
        }
    }
    else if (action == FocusZoneActionShiftTab)
    {
        nextViewToFocus = [self previousValidKeyView];
        while([nextViewToFocus isDescendantOf:focusZoneAncestor])
        {
            // there are no views left in the key view loop
            if ([nextViewToFocus isEqual:focusZoneAncestor])
            {
                nextViewToFocus = nil;
                break;
            }
            nextViewToFocus = [nextViewToFocus previousValidKeyView];
        }

        // If the previous view is in a FocusZone, focus on its defaultKeyView
        // (For FocusZoneActionTab, this is handled by becomeFirstResponder).
        focusZoneAncestor = GetFocusZoneAncestor(nextViewToFocus);
        NSView *ancestorKeyView = [focusZoneAncestor defaultResponder];
        if (ancestorKeyView != nil) {
            nextViewToFocus = [focusZoneAncestor defaultResponder];
        }
    }

    return nextViewToFocus;
}

- (NSView *)nextViewToFocusForTab:(FocusZoneAction)action
{
    [[self window] recalculateKeyViewLoop];

    NSString *tabKeyNavigation = [self tabKeyNavigation];
    if (![@"NavigateWrap" isEqual:tabKeyNavigation] && ![@"NavigateStopAtEnds" isEqual:tabKeyNavigation]
        && ![@"Normal" isEqual:tabKeyNavigation])
    {
        return [self nextViewToFocusOutsideZone:action];
    }

    BOOL forward = action != FocusZoneActionShiftTab;
    NSView *firstResponder = GetFirstResponder([self window]);
    NSView *nextViewToFocus = forward ? [firstResponder nextValidKeyView] : [firstResponder previousValidKeyView];

    if (nextViewToFocus == self)
        nextViewToFocus = forward ? [nextViewToFocus nextValidKeyView] : [nextViewToFocus previousValidKeyView];;

    if ([@"Normal" isEqual:tabKeyNavigation] || [nextViewToFocus isDescendantOf:self])
        return nextViewToFocus;

    if ([@"NavigateStopAtEnds" isEqual:tabKeyNavigation])
        return nil;

    // wrap around -- find first (tab) or last (shift+tab)
    NSView *aView = firstResponder;
    while (aView != self && [aView isDescendantOf:self])
    {
        nextViewToFocus = aView;
        aView = forward ? [aView previousValidKeyView] : [aView nextValidKeyView];
    }

    return nextViewToFocus != firstResponder ? nextViewToFocus : nil;
}

- (BOOL)isFlipped
{
    return YES;
}

- (void)keyDown:(NSEvent *)event
{
    NSLog(@"keyDown called");
    FocusZoneAction action = GetActionForEvent(event);
    FocusZoneDirection focusZoneDirection = [self focusZoneDirection];
    NSString *navigateAtEnd = [self navigateAtEnd];

    BOOL passthrough = NO;
    NSView *viewToFocus = nil;
    if ([self disabled] || action == FocusZoneActionNone)
    {
        passthrough = YES;
    }
    else if (action == FocusZoneActionTab || action == FocusZoneActionShiftTab)
    {
        viewToFocus = [self nextViewToFocusForTab:action];
    }
    else if ((focusZoneDirection == FocusZoneDirectionVertical
            && (action == FocusZoneActionRightArrow || action == FocusZoneActionLeftArrow))
        || (focusZoneDirection == FocusZoneDirectionHorizontal
            && (action == FocusZoneActionUpArrow || action == FocusZoneActionDownArrow))
        || (focusZoneDirection == FocusZoneDirectionNone))
    {
        passthrough = YES;
    }
    else
    {
        viewToFocus = [self nextViewToFocusWithFallback:action considerCircular:[@"NavigateWrap" isEqual:navigateAtEnd]];
    }

    if (viewToFocus != nil)
    {
        BOOL bb = [[self window] makeFirstResponder:viewToFocus];
        NSString *nativeID = nil;
        // Safely get nativeID if the view responds to it
        if ([viewToFocus isKindOfClass:[RCTViewComponentView class]]) {
            nativeID = ((RCTViewComponentView *)viewToFocus).nativeId;
        }
        NSLog(@"keyDown,makeFirstResponder:%d,nativeID:%@",bb,nativeID ?: @"(nil)");

        [viewToFocus scrollRectToVisible:[viewToFocus bounds]];
    }
    else if (passthrough)
    {
        // Only call super if we explicitly want to passthrough the event
        // I.E: FocusZone don't handle this specific key
        [super keyDown:event];
    }
}
@end

