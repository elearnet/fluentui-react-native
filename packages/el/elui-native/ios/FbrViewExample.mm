#import "FbrViewExample.h"
#import <react/renderer/components/ELUISpec/ComponentDescriptors.h>
#import <react/renderer/components/ELUISpec/EventEmitters.h>
#import <react/renderer/components/ELUISpec/Props.h>
#import <react/renderer/components/ELUISpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface FbrViewExample1 () <RCTFbrViewExampleViewProtocol>

@end

@implementation FbrViewExample1 {
    #if __has_include(<UIKit/UIKit.h>)
    UIView * _view;
    #elif __has_include(<AppKit/AppKit.h>)
    NSView * _view;
    #endif
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<FbrViewExampleComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::shared_ptr<const FbrViewExampleProps>(new FbrViewExampleProps());
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
    const auto &oldViewProps = *std::static_pointer_cast<FbrViewExampleProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<FbrViewExampleProps const>(props);

    if (oldViewProps.color != newViewProps.color) {
        NSString * colorToConvert = [[NSString alloc] initWithUTF8String:newViewProps.color.c_str()];
    #if __has_include(<UIKit/UIKit.h>)
        [_view setBackgroundColor:[self hexStringToColor:colorToConvert]];
    #elif __has_include(<AppKit/AppKit.h>)
        _view.wantsLayer = YES;
        _view.layer.backgroundColor = [[self hexStringToColor:colorToConvert] CGColor];
    #endif
    }

    [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> FbrViewExampleCls(void)
{
    return FbrViewExample1.class;
}

- (id)hexStringToColor:(NSString *)stringToConvert
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

@end
