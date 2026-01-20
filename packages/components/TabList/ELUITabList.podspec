require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'ELUITabList'
  s.module_name  = 'ELUITabList'
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = "https://github.com/microsoft/fluentui-react-native"

  s.source           = { :git => "https://github.com/microsoft/fluentui-react-native.git", :tag => "#{s.version}" }
  s.swift_version    = "5"

  s.osx.deployment_target = "11.0"
  s.osx.source_files      = "ios/**/*.{h,m,mm}"

  s.dependency 'React'

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
      s.exclude_files = ["ios/oldarch/"]
  else
      # In Old Architecture, exclude the Hybrid Wrapper which depends on Nitro
      s.exclude_files = ["ios/newarch/"]
  end

  install_modules_dependencies(s)
end
