#import "CompatibleView.h"
static id HexStringToColor(NSString *stringToConvert)
{
    NSString *noHashString = [stringToConvert stringByReplacingOccurrencesOfString:@"#" withString:@""];
    NSScanner *stringScanner = [NSScanner scannerWithString:noHashString];

    unsigned hex;
    if (![stringScanner scanHexInt:&hex]) return nil;
    int r = (hex >> 16) & 0xFF;
    int g = (hex >> 8) & 0xFF;
    int b = (hex) & 0xFF;

#if __has_include(<UIKit/UIKit.h>)
    return [UIColor colorWithRed:r / 255.0f green:g / 255.0f blue:b / 255.0f alpha:1.0f];
#elif __has_include(<AppKit/AppKit.h>)
    return [NSColor colorWithRed:r / 255.0f green:g / 255.0f blue:b / 255.0f alpha:1.0f];
#endif
}

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/ETESTSpec/ComponentDescriptors.h>
#import <react/renderer/components/ETESTSpec/EventEmitters.h>
#import <react/renderer/components/ETESTSpec/Props.h>
#import <react/renderer/components/ETESTSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation CompatibleView {
    #if __has_include(<UIKit/UIKit.h>)
    UIView * _view;
    #elif __has_include(<AppKit/AppKit.h>)
    NSView * _view;
    #endif
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<CompatibleViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::shared_ptr<const CompatibleViewProps>(new CompatibleViewProps());
    _props = defaultProps;
#if __has_include(<UIKit/UIKit.h>)
      _view = [[UIView alloc] init];
#elif __has_include(<AppKit/AppKit.h>)
      _view = [[NSView alloc] init];
    #endif

    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<CompatibleViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<CompatibleViewProps const>(props);

    if (oldViewProps.color != newViewProps.color) {
        NSString * colorToConvert = [[NSString alloc] initWithUTF8String:newViewProps.color.c_str()];
    #if __has_include(<UIKit/UIKit.h>)
        [_view setBackgroundColor:HexStringToColor(colorToConvert)];
    #elif __has_include(<AppKit/AppKit.h>)
        _view.wantsLayer = YES;
        _view.layer.backgroundColor = [HexStringToColor(colorToConvert) CGColor];
    #endif
    }

    [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> CompatibleViewCls(void)
{
    return CompatibleView.class;
}

@end
#else
@implementation CompatibleViewManager

RCT_EXPORT_MODULE()

#if __has_include(<UIKit/UIKit.h>)
- (UIView *)view {
  return [[UIView alloc] init];
}
#elif __has_include(<AppKit/AppKit.h>)
- (NSView *)view {
  return [[NSView alloc] init];
}
#endif

#if __has_include(<UIKit/UIKit.h>)
RCT_CUSTOM_VIEW_PROPERTY(color, NSString, UIView)
{
    if (json) {
        NSString *colorString = [RCTConvert NSString:json];
        view.backgroundColor = HexStringToColor(colorString);
    }
}
#elif __has_include(<AppKit/AppKit.h>)
RCT_CUSTOM_VIEW_PROPERTY(color, NSString, NSView)
{
    if (json) {
        NSString *colorString = [RCTConvert NSString:json];
        view.wantsLayer = YES;
        view.layer.backgroundColor = [HexStringToColor(colorString) CGColor];
    }
}
#endif

@end
#endif
