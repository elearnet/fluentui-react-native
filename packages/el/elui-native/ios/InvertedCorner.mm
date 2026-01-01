#import "InvertedCorner.h"
//#ifdef __has_include
#if __has_include(<AppKit/AppKit.h>)
// #import <Cocoa/Cocoa.h>
#import <QuartzCore/QuartzCore.h>
#endif
//#endif
#import <react/renderer/components/ELUISpec/ComponentDescriptors.h>
#import <react/renderer/components/ELUISpec/EventEmitters.h>
#import <react/renderer/components/ELUISpec/Props.h>
#import <react/renderer/components/ELUISpec/RCTComponentViewHelpers.h>
#import "RCTFabricComponentsPlugins.h"
using namespace facebook::react;
@interface InvertedCorner () <RCTInvertedCornerViewProtocol>
@end
@implementation InvertedCorner {
#if __has_include(<AppKit/AppKit.h>)
    NSView *_view;
    CAShapeLayer *_shapeLayer;
    NSString *_cornerPosition;
    CGFloat _cornerRadius;
    NSColor *_fillColor;
#endif
}
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<InvertedCornerComponentDescriptor>();
}
- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::shared_ptr<const InvertedCornerProps>(new InvertedCornerProps());
        _props = defaultProps;
#if __has_include(<AppKit/AppKit.h>)
        _cornerPosition = @"left";
        _cornerRadius = 6.0;
        _fillColor = [NSColor clearColor];
        _view = [[NSView alloc] init];
        _view.wantsLayer = YES;
        _view.layer.backgroundColor = [[NSColor clearColor] CGColor];
        // Shape layer fills the L-shape (rectangle minus quarter circle)
        _shapeLayer = [CAShapeLayer layer];
        _shapeLayer.fillColor = [_fillColor CGColor];
        _shapeLayer.strokeColor = nil;
        [_view.layer addSublayer:_shapeLayer];
        self.contentView = _view;
#endif
    }
    return self;
}
- (void)layout
{
    [super layout];
    [self updateShape];
}
- (void)updateShape
{
#if __has_include(<AppKit/AppKit.h>)
    CGRect bounds = _view.bounds;
    CGFloat w = bounds.size.width;
    CGFloat h = bounds.size.height;
    CGFloat r = _cornerRadius;
    if (r > w) r = w;
    if (r > h) r = h;
    _shapeLayer.frame = bounds;
    // Draw filled L-shape with quarter-circle notch
    // The notch is TRANSPARENT (not filled), everything else is filled with color
    CGMutablePathRef path = CGPathCreateMutable();
    // macOS coords: (0,0) = bottom-left
    if ([_cornerPosition isEqualToString:@"left"]) {
        /*
         y-axis
           ↑
           │
         h │  top-left         top-right
           │     ●───────────────●
           │     │               │
           │     │               │
           │     │               │
           │     ●───────────────●
         0 │  bottom-left     bottom-right
           │  (0, 0)          (w, 0)
           └────────────────────────────→ x-axis
           0                           w
         */
        CGPathMoveToPoint(path, NULL, 0, 0);              // bottom-left
        CGPathMoveToPoint(path, NULL, w, 0);              // bottom-right
        CGPathAddLineToPoint(path, NULL, w, h);           // top-right
        CGPathAddLineToPoint(path, NULL, w, r);           // to curve started
        CGPathAddArc(path, NULL, w - r, r, r, 0, -M_PI_2, YES); //Quarter circle
        CGPathAddLineToPoint(path, NULL, 0, 0);           // back to start
        CGPathCloseSubpath(path);
    } else {
        CGPathMoveToPoint(path, NULL, w, 0);              // bottom-right
        CGPathMoveToPoint(path, NULL, 0, 0);              // bottom-left
        CGPathAddLineToPoint(path, NULL, 0, h);           // top-left
        CGPathAddLineToPoint(path, NULL, 0, r);           // to curve started
      // Quarter circle notch (clockwise = cut inward)
        CGPathAddArc(path, NULL, r, r, r, M_PI, M_PI + M_PI_2, NO);
        CGPathAddLineToPoint(path, NULL, w, 0);           // back to start
        CGPathCloseSubpath(path);
    }
    _shapeLayer.path = path;
    CGPathRelease(path);
#endif
}
- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<InvertedCornerProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<InvertedCornerProps const>(props);
#if __has_include(<AppKit/AppKit.h>)
    // Update fill color
    if (oldViewProps.cornerColor != newViewProps.cornerColor) {
        NSString *colorString = [[NSString alloc] initWithUTF8String:newViewProps.cornerColor.c_str()];
        _fillColor = [self hexStringToColor:colorString];
        _shapeLayer.fillColor = [_fillColor CGColor];
    }
    // Update position
    if (oldViewProps.cornerPosition != newViewProps.cornerPosition) {
        _cornerPosition = [[NSString alloc] initWithUTF8String:newViewProps.cornerPosition.c_str()];
        [self updateShape];
    }
    // Update corner radius
    if (oldViewProps.cornerRadius != newViewProps.cornerRadius) {
        _cornerRadius = (CGFloat)newViewProps.cornerRadius;
        [self updateShape];
    }
#endif
    [super updateProps:props oldProps:oldProps];
}
Class<RCTComponentViewProtocol> InvertedCornerCls(void)
{
    return InvertedCorner.class;
}
- (NSColor *)hexStringToColor:(NSString *)stringToConvert
{
    if (!stringToConvert || stringToConvert.length == 0) {
        return [NSColor grayColor];
    }
    NSString *noHashString = [stringToConvert stringByReplacingOccurrencesOfString:@"#" withString:@""];
    NSScanner *stringScanner = [NSScanner scannerWithString:noHashString];
    unsigned long long hex = 0;
    if (![stringScanner scanHexLongLong:&hex]) return [NSColor grayColor];
    CGFloat r, g, b, a = 1.0;
    if (noHashString.length == 8) {
        r = ((hex >> 24) & 0xFF) / 255.0f;
        g = ((hex >> 16) & 0xFF) / 255.0f;
        b = ((hex >> 8) & 0xFF) / 255.0f;
        a = (hex & 0xFF) / 255.0f;
    } else if (noHashString.length == 6) {
        r = ((hex >> 16) & 0xFF) / 255.0f;
        g = ((hex >> 8) & 0xFF) / 255.0f;
        b = (hex & 0xFF) / 255.0f;
    } else {
        return [NSColor grayColor];
    }
    return [NSColor colorWithRed:r green:g blue:b alpha:a];
}
@end
