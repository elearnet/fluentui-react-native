// #import "FocusZone.h"
// #import <react/renderer/components/ETESTSpec/ComponentDescriptors.h>
// #import <react/renderer/components/ETESTSpec/EventEmitters.h>
// #import <react/renderer/components/ETESTSpec/Props.h>
// #import <react/renderer/components/ETESTSpec/RCTComponentViewHelpers.h>
//
// #import "RCTFabricComponentsPlugins.h"
//
// using namespace facebook::react;
//
// static id HexStringToColor(NSString *stringToConvert)
// {
//     NSString *noHashString = [stringToConvert stringByReplacingOccurrencesOfString:@"#" withString:@""];
//     NSScanner *stringScanner = [NSScanner scannerWithString:noHashString];
//
//     unsigned hex;
//     if (![stringScanner scanHexInt:&hex]) return nil;
//     int r = (hex >> 16) & 0xFF;
//     int g = (hex >> 8) & 0xFF;
//     int b = (hex) & 0xFF;
//
//   return [NSColor colorWithRed:r / 255.0f green:g / 255.0f blue:b / 255.0f alpha:1.0f];
// }
//
// @interface FocusZone () <RCTRCTFocusZoneViewProtocol>
//
// @end
//
// @implementation FocusZone {
//   //BOOL _disabled;
//   //facebook::react::RCTFocusZoneFocusZoneDirection _focusZoneDirection;
// //  NSString *_navigateAtEnd;
// //  NSString *_tabKeyNavigation;
// //  NSView *_defaultResponder;
//   NSView * _view;
// }
//
// + (ComponentDescriptorProvider)componentDescriptorProvider
// {
//   return concreteComponentDescriptorProvider<RCTFocusZoneComponentDescriptor>();
// }
// //
// // + (void)load
// // {
// //     NSLog(@"[FocusZone] +load: RCTFocusZone class loaded! self=%@", self);
// //
// //     // Verify NSClassFromString can find us
// //     Class foundClass = NSClassFromString(@"RCTFocusZone");
// //     NSLog(@"[FocusZone] +load: NSClassFromString(@\"RCTFocusZone\") = %@, matches self: %d",
// //           foundClass, foundClass == self);
// // }
// //
// // + (void)initialize
// // {
// //     if (self == [RCTFocusZone class]) {
// //         NSLog(@"[FocusZone] +initialize: RCTFocusZone class initialized!");
// //     }
// // }
// //
// // - (instancetype)init {
// //   self = [super init];
// //   NSLog(@"init called");
// //   return self;
// // }
// //
// // + (id)allocWithZone:(struct _NSZone *)zone {
// //      NSLog(@"[FocusZone] +allocWithZone: %@", self);
// //      return [super allocWithZone:zone];
// //    }
//
// - (instancetype)initWithFrame:(CGRect)frame
// {
//   if (self = [super initWithFrame:frame]) {
//     static const auto defaultProps = std::shared_ptr<const RCTFocusZoneProps>(new RCTFocusZoneProps());
//     _props = defaultProps;
//     //_focusZoneDirection = facebook::react::RCTFocusZoneFocusZoneDirection::Bidirectional;
// //    _navigateAtEnd = @"NavigateStopAtEnds";
// //    _tabKeyNavigation = @"None";
// //    _disabled = NO;
//
// //    self.contentView = [[NSView alloc] init];
// //    self.contentView.wantsLayer = YES;
// //    self.contentView.layer.backgroundColor = [[NSColor redColor] CGColor];
//     _view = [[NSView alloc] init];
//     self.contentView = _view;
//   }
//
//   return self;
// }
//
// - (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
// {
//     const auto &oldViewProps = *std::static_pointer_cast<RCTFocusZoneProps const>(_props);
//     const auto &newViewProps = *std::static_pointer_cast<RCTFocusZoneProps const>(props);
//
//     // Update disabled
//     //_disabled = newViewProps.disabled;
//
//     // Update focusZoneDirection
//     /*
//     if (newViewProps.focusZoneDirection == RCTFocusZoneFocusZoneDirection::Bidirectional) {
//         _focusZoneDirection = facebook::react::RCTFocusZoneFocusZoneDirection::Bidirectional;
//     } else if (newViewProps.focusZoneDirection == RCTFocusZoneFocusZoneDirection::Vertical) {
//         _focusZoneDirection = facebook::react::RCTFocusZoneFocusZoneDirection::Vertical;
//     } else if (newViewProps.focusZoneDirection == RCTFocusZoneFocusZoneDirection::Horizontal) {
//         _focusZoneDirection = facebook::react::RCTFocusZoneFocusZoneDirection::Horizontal;
//     } else if (newViewProps.focusZoneDirection == RCTFocusZoneFocusZoneDirection::None) {
//         _focusZoneDirection = facebook::react::RCTFocusZoneFocusZoneDirection::None;
//     }
//
//     // Update navigateAtEnd
//     if (newViewProps.navigateAtEnd == RCTFocusZoneNavigateAtEnd::NavigateStopAtEnds) {
//         _navigateAtEnd = @"NavigateStopAtEnds";
//     } else if (newViewProps.navigateAtEnd == RCTFocusZoneNavigateAtEnd::NavigateWrap) {
//         _navigateAtEnd = @"NavigateWrap";
//     } else if (newViewProps.navigateAtEnd == RCTFocusZoneNavigateAtEnd::NavigateContinue) {
//         _navigateAtEnd = @"NavigateContinue";
//     }
//
//     // Update tabKeyNavigation
//     if (newViewProps.tabKeyNavigation == RCTFocusZoneTabKeyNavigation::None) {
//         _tabKeyNavigation = @"None";
//     } else if (newViewProps.tabKeyNavigation == RCTFocusZoneTabKeyNavigation::NavigateWrap) {
//         _tabKeyNavigation = @"NavigateWrap";
//     } else if (newViewProps.tabKeyNavigation == RCTFocusZoneTabKeyNavigation::NavigateStopAtEnds) {
//         _tabKeyNavigation = @"NavigateStopAtEnds";
//     } else if (newViewProps.tabKeyNavigation == RCTFocusZoneTabKeyNavigation::Normal) {
//         _tabKeyNavigation = @"Normal";
//     }*/
//
//   if (oldViewProps.color != newViewProps.color) {
//       NSString * colorToConvert = [[NSString alloc] initWithUTF8String:newViewProps.color.c_str()];
//     _view.wantsLayer = YES;
//     _view.layer.backgroundColor = [HexStringToColor(colorToConvert) CGColor];
//   }
//
//     [super updateProps:props oldProps:oldProps];
// }
//
// - (void)keyDown:(NSEvent *)event
// {
//     NSLog(@"[FocusZone] keyDown: keyCode=%hu, characters=%@", [event keyCode], [event characters]);
// }
//
// Class<RCTComponentViewProtocol> FocusZoneCls(void)
// {
//     return FocusZone.class;
// }
//
// @end
//
