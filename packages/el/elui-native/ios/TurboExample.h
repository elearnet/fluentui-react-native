#import <React/RCTBridgeModule.h>
// 1. Check if New Architecture is enabled
#ifdef RCT_NEW_ARCH_ENABLED
#import <ELUISpec/ELUISpec.h>
@interface TurboExample : NSObject <NativeTurboExampleSpec>
#else
// 2. Fallback for Legacy Architecture
@interface TurboExample : NSObject <RCTBridgeModule>
#endif

@end
