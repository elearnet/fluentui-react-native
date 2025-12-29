@objc(NewWindow)
class NewWindow: NSObject, NativeNewWindowSpec {
  // Keep track of open windows to prevent duplicates or manage them
  var windowRegistry: [String: NSWindow] = [:]

  func open(_ rescType: String,_ rescId: String, title: String) {
    DispatchQueue.main.async {
      // 1. Check if the book is already open; if so, bring it to front
      if let existingWindow = self.windowRegistry[rescType,rescId] {
        existingWindow.makeKeyAndOrderFront(nil)
        return
      }

      // 2. Create a unique window
      let window = NSWindow(
        contentRect: NSRect(x: 0, y: 0, width: 800, height: 1000),
        styleMask: [.titled, .closable, .miniaturizable, .resizable],
        backing: .buffered, defer: false)

      window.title = title
      window.isReleasedWhenClosed = false

      // 3. Attach the React Surface
      if let appDelegate = NSApp.delegate as? RCTAppDelegate {
        let rootView = appDelegate.rootViewFactory.view(
          withModuleName: "NewWindow",
          initialProperties: ["rescType": rescType,"rescId": rescId] // Each instance gets its own ID
        )

        window.contentView = rootView
        window.makeKeyAndOrderFront(nil)

        // Store reference
        self.windowRegistry[rescType,rescId] = window

        // Remove from registry when window closes
        NotificationCenter.default.addObserver(
          forName: NSWindow.willCloseNotification,
          object: window,
          queue: .main
        ) { _ in
          self.windowRegistry.removeValue(forKey: (rescType,rescId))
        }
      }
    }
  }
}