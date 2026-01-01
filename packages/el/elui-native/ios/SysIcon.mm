#import "SysIcon.h"
#import <TargetConditionals.h>

#import <react/renderer/components/ELUISpec/ComponentDescriptors.h>
#import <react/renderer/components/ELUISpec/EventEmitters.h>
#import <react/renderer/components/ELUISpec/Props.h>
#import <react/renderer/components/ELUISpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface SysIcon () <RCTSysIconViewProtocol>

@end

@implementation SysIcon {
#if TARGET_OS_OSX
    NSImageView * _view;
#else
    UIImageView * _view;
#endif
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<SysIconComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::shared_ptr<const SysIconProps>(new SysIconProps());
    _props = defaultProps;

#if TARGET_OS_OSX
    _view = [[NSImageView alloc] initWithFrame:self.bounds];
    _view.wantsLayer = YES;
    _view.imageScaling = NSImageScaleProportionallyUpOrDown;
#else
    _view = [[UIImageView alloc] initWithFrame:self.bounds];
    _view.contentMode = UIViewContentModeScaleAspectFit;
#endif

    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<SysIconProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<SysIconProps const>(props);

    if (oldViewProps.symbolName != newViewProps.symbolName) {
        NSString * symbolName = [[NSString alloc] initWithUTF8String: newViewProps.symbolName.c_str()];

#if TARGET_OS_OSX
        if (@available(macOS 11.0, *)) {
            NSImage *image = [NSImage imageWithSystemSymbolName:symbolName accessibilityDescription:@""];
            _view.image = image;
        }
#else
        if (@available(iOS 13.0, *)) {
            UIImage *image = [UIImage systemImageNamed:symbolName];
            _view.image = image;
        }
#endif
    }

    [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> SysIconCls(void)
{
    return SysIcon.class;
}

@end
