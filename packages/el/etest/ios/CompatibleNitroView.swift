//#if  RCT_NEW_ARCH_ENABLED
 //test
//#endif

#if canImport(UIKit)
class HybridCompatibleNitroView : HybridCompatibleNitroViewSpec {


  // UIView
  var view: UIView = UIView()

  // props
  var color: String = "#000" {
    didSet {
      view.backgroundColor = hexStringToUIColor(hexColor: color)
    }
  }

  func hexStringToUIColor(hexColor: String) -> UIColor {
    let stringScanner = Scanner(string: hexColor)

    if(hexColor.hasPrefix("#")) {
      stringScanner.scanLocation = 1
    }
    var color: UInt32 = 0
    stringScanner.scanHexInt32(&color)

    let r = CGFloat(Int(color >> 16) & 0x000000FF)
    let g = CGFloat(Int(color >> 8) & 0x000000FF)
    let b = CGFloat(Int(color) & 0x000000FF)

    return UIColor(red: r / 255.0, green: g / 255.0, blue: b / 255.0, alpha: 1)
  }
}
#elseif canImport(AppKit)
class HybridCompatibleNitroView : HybridCompatibleNitroViewSpec {
  lazy var view: NSView = CompatibleNitroViewShare()

  override init() {
    super.init()
  }

  // props
  var color: String = "#000" {
    didSet {
    #if SWIFT_CXX_INTEROP
    print("Using modern C++ interop")
    #else
    print("Using legacy ObjC bridge")
    #endif
      (view as? CompatibleNitroViewShare)?.color = color
    }
  }
  var startFrom: Double? {
    didSet {
        (view as? CompatibleNitroViewShare)?.startFrom = NSNumber(value: startFrom ?? 0)
    }
  }
  var onTick: ((Double) -> Void)? {
      didSet {
          (view as? CompatibleNitroViewShare)?.onTick = { [weak self] data in
              if let count = data["count"] as? Double {
                  self?.onTick?(count)
              }
          }
      }
  }

  func reset() throws {
      (view as? CompatibleNitroViewShare)?.reset()
  }
}
#endif
