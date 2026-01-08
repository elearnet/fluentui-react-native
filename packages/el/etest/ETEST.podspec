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
  s.static_framework = true
  s.source       = { :git => "https://github.com/elearnet/ELUI.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift,cpp}"
  #s.private_header_files = "ios/**/*.h"
#   s.public_header_files = ["ios/callout/ETESTFactory.h","ios/callout/RootViewDelegate.h","ios/callout/ContainerView.h"]


#   s.dependency 'React-jsi'
#   s.dependency 'React-callinvoker'

  if File.exist?(File.join(__dir__, "nitrogen/generated/ios/ETEST+autolinking.rb"))
    load 'nitrogen/generated/ios/ETEST+autolinking.rb'
    add_nitrogen_files(s)
  end

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
    s.exclude_files = ["ios/CompatibleNitroView.m"]
    current_config = s.attributes_hash['pod_target_xcconfig'] || {}
    s.pod_target_xcconfig = current_config.merge({
        "OTHER_SWIFT_FLAGS" => "$(inherited) -D RCT_NEW_ARCH_ENABLED",
        "CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES" => "YES",
        "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) FOLLY_NO_CONFIG=1 FOLLY_MOBILE=1 FOLLY_USE_LIBCPP=1 GOOGLE_GLOG_DLL_DECL=\"\""
    })
    #-cxx-interop-mode=default", # enable c++ interop
  else
    # In Old Architecture, exclude the Hybrid Wrapper which depends on Nitro
    s.exclude_files = ["ios/CompatibleNitroView.swift","nitrogen/","ios/callout/"]
  end
  install_modules_dependencies(s)
end
