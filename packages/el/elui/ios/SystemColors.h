#import <React/RCTBridgeModule.h>
#ifdef RCT_NEW_ARCH_ENABLED
#import <ELUISpec/ELUISpec.h>
@interface SystemColors : NSObject <NativeSystemColorsSpec>
#else
@interface SystemColors : NSObject <RCTBridgeModule>
#endif

@end
