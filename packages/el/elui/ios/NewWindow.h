
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <ELUISpec/ELUISpec.h>
@interface NewWindow : NSObject <NativeNewWindowSpec>
#else
@interface NewWindow : NSObject <RCTBridgeModule>
#endif

@end
