#import <Foundation/Foundation.h>

// Set this to 1 to enable logs, 0 to disable
#define ENABLE_DEV_LOG 1

#if ENABLE_DEV_LOG
    #define DevLog(fmt, ...) NSLog(fmt, ##__VA_ARGS__)
#else
    #define DevLog(fmt, ...) do {} while(0)
#endif
