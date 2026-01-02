require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ETEST"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported,:macos => "11.0" }
  s.source       = { :git => "https://github.com/elearnet/ELUI.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift,cpp}"
  s.private_header_files = "ios/**/*.h"

#   s.dependency 'React-jsi'
#   s.dependency 'React-callinvoker'

  if File.exist?(File.join(__dir__, "nitrogen/generated/ios/ETEST+autolinking.rb"))
    load 'nitrogen/generated/ios/ETEST+autolinking.rb'
    add_nitrogen_files(s)
  end

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
    s.pod_target_xcconfig = { "OTHER_SWIFT_FLAGS" => "-D RCT_NEW_ARCH_ENABLED" }
  end

  install_modules_dependencies(s)
end
