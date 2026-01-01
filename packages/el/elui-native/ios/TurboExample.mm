#import "TurboExample.h"

@implementation TurboExample
RCT_EXPORT_MODULE()

#ifndef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(multiply:(double)a b:(double)b)
{
  return @(a * b);
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}
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
