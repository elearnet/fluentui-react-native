#import "SystemColors.h"

#if TARGET_OS_OSX
#import <AppKit/AppKit.h>
#else
#import <UIKit/UIKit.h>
#endif

@implementation SystemColors

RCT_EXPORT_MODULE()

#pragma mark - Helper Methods

/**
 * Convert a native color to hex string.
 * Converts to sRGB color space first for accurate color representation.
 */
#if TARGET_OS_OSX
- (NSString *)hexStringFromColor:(NSColor *)color {
    if (!color) {
        return nil;
    }

    // IMPORTANT: We need to resolve the color in the app's current appearance context
    // Otherwise dynamic colors (like windowBackgroundColor) won't resolve correctly
    NSAppearance *savedAppearance = NSAppearance.currentAppearance;
    NSAppearance.currentAppearance = NSApp.effectiveAppearance;

    // Convert to sRGB color space for consistent representation
    NSColor *rgbColor = [color colorUsingColorSpace:[NSColorSpace sRGBColorSpace]];
    if (!rgbColor) {
        // Fallback: try to get calibrated RGB
        rgbColor = [color colorUsingType:NSColorTypeComponentBased];
        if (!rgbColor) {
            NSAppearance.currentAppearance = savedAppearance;
            return nil;
        }
    }

    CGFloat red, green, blue, alpha;
    [rgbColor getRed:&red green:&green blue:&blue alpha:&alpha];

    // Restore appearance
    NSAppearance.currentAppearance = savedAppearance;

    int r = (int)round(red * 255.0);
    int g = (int)round(green * 255.0);
    int b = (int)round(blue * 255.0);

    // Clamp values to 0-255 range
    r = MAX(0, MIN(255, r));
    g = MAX(0, MIN(255, g));
    b = MAX(0, MIN(255, b));

    if (alpha < 1.0) {
        int a = (int)round(alpha * 255.0);
        a = MAX(0, MIN(255, a));
        return [NSString stringWithFormat:@"#%02X%02X%02X%02X", r, g, b, a];
    }

    return [NSString stringWithFormat:@"#%02X%02X%02X", r, g, b];
}

/**
 * Get NSColor by name using selector lookup.
 */
- (NSColor *)colorForName:(NSString *)colorName {
    // Map of supported color names to NSColor selectors
    static NSDictionary<NSString *, NSString *> *colorSelectors = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        colorSelectors = @{
            // Label Colors
            @"labelColor": @"labelColor",
            @"secondaryLabelColor": @"secondaryLabelColor",
            @"tertiaryLabelColor": @"tertiaryLabelColor",
            @"quaternaryLabelColor": @"quaternaryLabelColor",

            // Text Colors
            @"textColor": @"textColor",
            @"placeholderTextColor": @"placeholderTextColor",
            @"selectedTextColor": @"selectedTextColor",
            @"textBackgroundColor": @"textBackgroundColor",
            @"selectedTextBackgroundColor": @"selectedTextBackgroundColor",
            @"keyboardFocusIndicatorColor": @"keyboardFocusIndicatorColor",
            @"unemphasizedSelectedTextColor": @"unemphasizedSelectedTextColor",
            @"unemphasizedSelectedTextBackgroundColor": @"unemphasizedSelectedTextBackgroundColor",

            // Content Colors
            @"linkColor": @"linkColor",
            @"separatorColor": @"separatorColor",
            @"selectedContentBackgroundColor": @"selectedContentBackgroundColor",
            @"unemphasizedSelectedContentBackgroundColor": @"unemphasizedSelectedContentBackgroundColor",

            // Menu Colors
            @"selectedMenuItemTextColor": @"selectedMenuItemTextColor",

            // Table Colors
            @"gridColor": @"gridColor",
            @"headerTextColor": @"headerTextColor",

            // Control Colors
            @"controlAccentColor": @"controlAccentColor",
            @"controlColor": @"controlColor",
            @"controlBackgroundColor": @"controlBackgroundColor",
            @"controlTextColor": @"controlTextColor",
            @"disabledControlTextColor": @"disabledControlTextColor",
            @"selectedControlColor": @"selectedControlColor",
            @"selectedControlTextColor": @"selectedControlTextColor",
            @"alternateSelectedControlTextColor": @"alternateSelectedControlTextColor",
            @"scrubberTexturedBackgroundColor": @"scrubberTexturedBackgroundColor",

            // Window Colors
            @"windowBackgroundColor": @"windowBackgroundColor",
            @"windowFrameTextColor": @"windowFrameTextColor",
            @"underPageBackgroundColor": @"underPageBackgroundColor",

            // Highlights and Shadows
            @"findHighlightColor": @"findHighlightColor",
            @"highlightColor": @"highlightColor",
            @"shadowColor": @"shadowColor",

            // System Colors
            @"systemBlueColor": @"systemBlueColor",
            @"systemBrownColor": @"systemBrownColor",
            @"systemGrayColor": @"systemGrayColor",
            @"systemGreenColor": @"systemGreenColor",
            @"systemIndigoColor": @"systemIndigoColor",
            @"systemOrangeColor": @"systemOrangeColor",
            @"systemPinkColor": @"systemPinkColor",
            @"systemPurpleColor": @"systemPurpleColor",
            @"systemRedColor": @"systemRedColor",
            @"systemTealColor": @"systemTealColor",
            @"systemYellowColor": @"systemYellowColor",
            @"clearColor": @"clearColor",
        };
    });

    NSString *selectorName = colorSelectors[colorName];
    if (!selectorName) {
        return nil;
    }

    SEL selector = NSSelectorFromString(selectorName);
    if ([NSColor respondsToSelector:selector]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
        return [NSColor performSelector:selector];
#pragma clang diagnostic pop
    }

    return nil;
}
#else
// iOS fallback implementation
- (NSString *)hexStringFromColor:(UIColor *)color {
    if (!color) {
        return nil;
    }

    CGFloat red, green, blue, alpha;
    if (![color getRed:&red green:&green blue:&blue alpha:&alpha]) {
        return nil;
    }

    int r = (int)round(red * 255.0);
    int g = (int)round(green * 255.0);
    int b = (int)round(blue * 255.0);

    r = MAX(0, MIN(255, r));
    g = MAX(0, MIN(255, g));
    b = MAX(0, MIN(255, b));

    return [NSString stringWithFormat:@"#%02X%02X%02X", r, g, b];
}

- (UIColor *)colorForName:(NSString *)colorName {
    // iOS implementation - basic system colors
    if ([colorName isEqualToString:@"systemBackgroundColor"]) {
        return [UIColor systemBackgroundColor];
    } else if ([colorName isEqualToString:@"labelColor"]) {
        return [UIColor labelColor];
    }
    return nil;
}
#endif

#pragma mark - TurboModule Methods

- (NSString *)getSystemColor:(NSString *)colorName {
#if TARGET_OS_OSX
    NSColor *color = [self colorForName:colorName];
    return [self hexStringFromColor:color];
#else
    UIColor *color = [self colorForName:colorName];
    return [self hexStringFromColor:color];
#endif
}

- (NSDictionary<NSString *, NSString *> *)getSystemColors {
    NSMutableDictionary<NSString *, NSString *> *colors = [NSMutableDictionary dictionary];

#if TARGET_OS_OSX
    // Common macOS colors that are most useful for UI
    NSArray<NSString *> *commonColors = @[
        @"windowBackgroundColor",
        @"controlBackgroundColor",
        @"textBackgroundColor",
        @"underPageBackgroundColor",
        @"labelColor",
        @"secondaryLabelColor",
        @"tertiaryLabelColor",
        @"separatorColor",
        @"controlAccentColor",
        @"selectedContentBackgroundColor",
        @"unemphasizedSelectedContentBackgroundColor",
        @"linkColor",
        @"controlColor",
        @"controlTextColor",
    ];

    for (NSString *colorName in commonColors) {
        NSColor *color = [self colorForName:colorName];
        NSString *hexColor = [self hexStringFromColor:color];
        if (hexColor) {
            colors[colorName] = hexColor;
        }
    }
#endif

    return [colors copy];
}

#ifndef RCT_NEW_ARCH_ENABLED
// Legacy architecture exports
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getSystemColor:(NSString *)colorName)
{
    return [self getSystemColor:colorName];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getSystemColors)
{
    return [self getSystemColors];
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeSystemColorsSpecJSI>(params);
}
#endif

@end
