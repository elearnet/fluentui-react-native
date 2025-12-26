#import "HoverableView.h"
#import <TargetConditionals.h>

#import <react/renderer/components/ELUISpec/ComponentDescriptors.h>
#import <react/renderer/components/ELUISpec/EventEmitters.h>
#import <react/renderer/components/ELUISpec/Props.h>
#import <react/renderer/components/ELUISpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface HoverableView () <RCTHoverableViewViewProtocol>

@end

@implementation HoverableView {
#if TARGET_OS_OSX
    NSTrackingArea *_trackingArea;
#endif
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<HoverableViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const HoverableViewProps>();
        _props = defaultProps;

#if TARGET_OS_OSX
        [self setupTrackingArea];
#endif
    }
    return self;
}

#if TARGET_OS_OSX

- (void)setupTrackingArea
{
    if (_trackingArea) {
        [self removeTrackingArea:_trackingArea];
    }

    _trackingArea = [[NSTrackingArea alloc] initWithRect:self.bounds
                                                 options:(NSTrackingMouseEnteredAndExited |
                                                         NSTrackingActiveAlways |
                                                         NSTrackingInVisibleRect)
                                                   owner:self
                                                userInfo:nil];
    [self addTrackingArea:_trackingArea];
}

- (void)updateTrackingAreas
{
    [super updateTrackingAreas];
    [self setupTrackingArea];
}

- (void)mouseEntered:(NSEvent *)event
{
    if (_eventEmitter) {
        auto emitter = std::static_pointer_cast<const HoverableViewEventEmitter>(_eventEmitter);
        emitter->onHoverIn({});
    }
}

- (void)mouseExited:(NSEvent *)event
{
    if (_eventEmitter) {
        auto emitter = std::static_pointer_cast<const HoverableViewEventEmitter>(_eventEmitter);
        emitter->onHoverOut({});
    }
}

#endif

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> HoverableViewCls(void)
{
    return HoverableView.class;
}

@end
