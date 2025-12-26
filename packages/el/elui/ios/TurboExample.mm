#import "TurboExample.h"

@implementation TurboExample
RCT_EXPORT_MODULE()

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

#ifndef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(multiply:(double)a b:(double)b)
{
    return [self multiply:a b:b];
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeTurboExampleSpecJSI>(params);
}

//don't need this, using : RCT_EXPORT_MODULE()
// + (NSString *)moduleName
// {
//   return @"TurboExample";
// }
#endif



@end
