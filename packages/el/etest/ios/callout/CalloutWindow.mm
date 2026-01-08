#import "CalloutWindow.h"

@implementation CalloutWindow

- (instancetype)initWithContentRect:(NSRect)contentRect
                          styleMask:(NSWindowStyleMask)style
                            backing:(NSBackingStoreType)backingStoreType
                              defer:(BOOL)flag
{
  // Enforce specific style for Callout behavior
  //  NSWindowStyleMask effectiveStyle = NSWindowStyleMaskBorderless | NSWindowStyleMaskNonactivatingPanel;
  NSWindowStyleMask effectiveStyle = NSWindowStyleMaskBorderless;

  if (self = [super initWithContentRect:contentRect
                              styleMask:effectiveStyle
                                backing:backingStoreType
                                  defer:flag]) {
    self.backgroundColor = [NSColor clearColor];
    self.level = NSFloatingWindowLevel;
    self.hasShadow = YES;
  }
  return self;
}

- (BOOL)canBecomeKeyWindow {
    return YES;
}

- (BOOL)canBecomeMainWindow {
    return NO;
}

- (void)cancelOperation:(id)sender {
    [self orderOut:sender];
}

@end
