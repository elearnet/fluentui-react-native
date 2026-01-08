#import "ProxyView.h"
#import <React/RCTViewComponentView.h>

@implementation FRNProxyView

- (instancetype)initWithFrame:(NSRect)frameRect {
    if (self = [super initWithFrame:frameRect]) {
        self.state = NSVisualEffectStateInactive;
        self.wantsLayer = YES;
    }
    return self;
}

- (BOOL)isFlipped {
	return YES;
}

@end
