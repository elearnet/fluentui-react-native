require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'FocusZone'
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = "https://github.com/microsoft/fluentui-react-native"

  s.source           = { :git => "https://github.com/microsoft/fluentui-react-native.git", :tag => "#{s.version}" }
  s.swift_version    = "5"

  s.osx.deployment_target = "11.0"
  s.osx.source_files      = "macos/**/*.{swift,h,m,mm}"

  s.dependency 'React'

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
    # Fabric (New Architecture) - exclude legacy implementation
    s.exclude_files = ["macos/*.{h,m}"]
  else
    # Paper (Legacy Architecture) - exclude newarch implementation
    s.exclude_files = ["macos/newarch/"]
  end

  install_modules_dependencies(s)
end

