#if canImport(UIKit)
class HybridELUI : HybridELUI_TESTSpec {

  
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
class HybridELUI : HybridELUI_TESTSpec {
  var view: NSView = NSImageView()
  //let myImage = NSImage(systemSymbolName: "star.fill", accessibilityDescription: "Star Icon")
  
  override init() {
    super.init()
    view.wantsLayer = true
    
    
    //(view as NSImageView).image = myImage
    //view.addSubview(myImage)
  }

  // props
  var color: String = "sidebar.right" {
    didSet {
      // view.layer?.backgroundColor = hexStringToNSColor(hexColor: color).cgColor
      
      // Cast it to NSImageView to access image properties
          if let imageView = view as? NSImageView {
              // 3. Configure the image view
            if #available(macOS 11.0, *) {
              imageView.image = NSImage(systemSymbolName: color, accessibilityDescription: "")
            } else {
              // Fallback on earlier versions
            }
              imageView.imageScaling = .scaleProportionallyUpOrDown
          }
    }
  }
  
  func hexStringToNSColor(hexColor: String) -> NSColor {
    let stringScanner = Scanner(string: hexColor)

    if(hexColor.hasPrefix("#")) {
      stringScanner.scanLocation = 1
    }
    var color: UInt32 = 0
    stringScanner.scanHexInt32(&color)

    let r = CGFloat(Int(color >> 16) & 0x000000FF)
    let g = CGFloat(Int(color >> 8) & 0x000000FF)
    let b = CGFloat(Int(color) & 0x000000FF)

    return NSColor(red: r / 255.0, green: g / 255.0, blue: b / 255.0, alpha: 1)
  }
}
#endif
