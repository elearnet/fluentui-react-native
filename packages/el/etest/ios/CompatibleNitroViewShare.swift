@objc(CompatibleNitroViewShare)
public class CompatibleNitroViewShare : NSView {
    lazy var view: NSView = {
      let v = NSView()
      v.wantsLayer = true
      startTimer()
      return v
    }()

    override init(frame: CGRect) {
      super.init(frame: frame)
      // trigger view creation
      _ = view
      self.addSubview(view)
      view.autoresizingMask = [.width, .height]
      view.frame = self.bounds
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    // props
    @objc var color: String = "#000" {
      didSet {
        view.layer?.backgroundColor = hexStringToNSColor(hexColor: color).cgColor
      }
    }
    @objc public var startFrom: NSNumber?

    // Legacy RN Event
    @objc public var onTick: (([AnyHashable: Any]) -> Void)?

//  @objc(setOnTick:)
//  public func setOnTick(_ callback: (([AnyHashable: Any]) -> Void)?) {
//      self.onTick = callback
//  }

    private var counter: Double = 0
    private var timer: Timer?

    private func startTimer() {
      timer?.invalidate()
      timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
        guard let self = self else { return }
        self.counter += 1
        // For Old Arch, we must pass a dictionary
        //print("Swift Timer from Old Arch: \(self.counter) callback: \(String(describing: self.onTick))")
        self.onTick?(["count": self.counter])
      }
    }

    deinit {
      timer?.invalidate()
    }

    @objc public func reset() {
        self.counter = Double(self.startFrom ?? 0)
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
