#import "InvertedCorner.h"

#if __has_include(<AppKit/AppKit.h>)
#import <QuartzCore/QuartzCore.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/ELUITabListSpec/ComponentDescriptors.h>
#import <react/renderer/components/ELUITabListSpec/EventEmitters.h>
#import <react/renderer/components/ELUITabListSpec/Props.h>
#import <react/renderer/components/ELUITabListSpec/RCTComponentViewHelpers.h>
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

    CGMutablePathRef path = CGPathCreateMutable();
    if ([_cornerPosition isEqualToString:@"left"]) {
        CGPathMoveToPoint(path, NULL, 0, 0);
        CGPathMoveToPoint(path, NULL, w, 0);
        CGPathAddLineToPoint(path, NULL, w, h);
        CGPathAddLineToPoint(path, NULL, w, r);
        CGPathAddArc(path, NULL, w - r, r, r, 0, -M_PI_2, YES);
        CGPathAddLineToPoint(path, NULL, 0, 0);
        CGPathCloseSubpath(path);
    } else {
        CGPathMoveToPoint(path, NULL, w, 0);
        CGPathMoveToPoint(path, NULL, 0, 0);
        CGPathAddLineToPoint(path, NULL, 0, h);
        CGPathAddLineToPoint(path, NULL, 0, r);
        CGPathAddArc(path, NULL, r, r, r, M_PI, M_PI + M_PI_2, NO);
        CGPathAddLineToPoint(path, NULL, w, 0);
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
    if (oldViewProps.cornerColor != newViewProps.cornerColor) {
        NSString *colorString = [[NSString alloc] initWithUTF8String:newViewProps.cornerColor.c_str()];
        _fillColor = [self hexStringToColor:colorString];
        _shapeLayer.fillColor = [_fillColor CGColor];
    }
    if (oldViewProps.cornerPosition != newViewProps.cornerPosition) {
        _cornerPosition = [[NSString alloc] initWithUTF8String:newViewProps.cornerPosition.c_str()];
        [self updateShape];
    }
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
#else

@interface InvertedCornerView : NSView
@property (nonatomic, strong) NSString *cornerPosition;
@property (nonatomic, assign) CGFloat cornerRadius;
@property (nonatomic, strong) NSColor *fillColor;
@end

@implementation InvertedCornerView {
    CAShapeLayer *_shapeLayer;
}

- (instancetype)init {
    self = [super init];
    if (self) {
         _cornerPosition = @"left";
         _cornerRadius = 6.0;
         _fillColor = [NSColor clearColor];
         self.wantsLayer = YES;
         self.layer.backgroundColor = [[NSColor clearColor] CGColor];

         _shapeLayer = [CAShapeLayer layer];
         _shapeLayer.fillColor = [_fillColor CGColor];
         _shapeLayer.strokeColor = nil;
         [self.layer addSublayer:_shapeLayer];
    }
    return self;
}

- (void)layout {
    [super layout];
    [self updateShape];
}

- (void)setCornerPosition:(NSString *)cornerPosition {
    if (![_cornerPosition isEqualToString:cornerPosition]) {
        _cornerPosition = cornerPosition;
        [self updateShape];
    }
}

- (void)setCornerRadius:(CGFloat)cornerRadius {
    if (_cornerRadius != cornerRadius) {
        _cornerRadius = cornerRadius;
        [self updateShape];
    }
}

- (void)setFillColor:(NSColor *)fillColor {
    if (![_fillColor isEqual:fillColor]) {
        _fillColor = fillColor;
        _shapeLayer.fillColor = [_fillColor CGColor];
    }
}

- (void)updateShape {
    CGRect bounds = self.bounds;
    CGFloat w = bounds.size.width;
    CGFloat h = bounds.size.height;
    CGFloat r = _cornerRadius;
    if (r > w) r = w;
    if (r > h) r = h;
    _shapeLayer.frame = bounds;

    CGMutablePathRef path = CGPathCreateMutable();
    if ([_cornerPosition isEqualToString:@"left"]) {
        CGPathMoveToPoint(path, NULL, 0, 0);
        CGPathMoveToPoint(path, NULL, w, 0);
        CGPathAddLineToPoint(path, NULL, w, h);
        CGPathAddLineToPoint(path, NULL, w, r);
        CGPathAddArc(path, NULL, w - r, r, r, 0, -M_PI_2, YES);
        CGPathAddLineToPoint(path, NULL, 0, 0);
        CGPathCloseSubpath(path);
    } else {
        CGPathMoveToPoint(path, NULL, w, 0);
        CGPathMoveToPoint(path, NULL, 0, 0);
        CGPathAddLineToPoint(path, NULL, 0, h);
        CGPathAddLineToPoint(path, NULL, 0, r);
        CGPathAddArc(path, NULL, r, r, r, M_PI, M_PI + M_PI_2, NO);
        CGPathAddLineToPoint(path, NULL, w, 0);
        CGPathCloseSubpath(path);
    }
    _shapeLayer.path = path;
    CGPathRelease(path);
}

@end

@implementation InvertedCornerManager

RCT_EXPORT_MODULE(InvertedCorner)

- (NSView *)view {
    return [[InvertedCornerView alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(cornerPosition, NSString, InvertedCornerView)
{
    if (json) {
        view.cornerPosition = [RCTConvert NSString:json];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(cornerRadius, NSNumber, InvertedCornerView)
{
    if (json) {
        view.cornerRadius = [RCTConvert CGFloat:json];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(cornerColor, NSString, InvertedCornerView)
{
    if (json) {
        NSString *colorString = [RCTConvert NSString:json];
        view.fillColor = [self hexStringToColor:colorString];
    }
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

#endif
