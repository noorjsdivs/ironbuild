/**
 * iOS 27 SDK requires the UIScene life cycle; apps without it assert at launch.
 * Expo SDK 57 ships `ExpoAppSceneDelegate` for this, but its prebuild template
 * still creates the window in the app delegate (fixed in the SDK 58 template).
 *
 * This plugin applies the SDK 58 wiring at prebuild:
 *  - Info.plist: a scene manifest pointing at Expo's scene delegate.
 *  - AppDelegate: conform to `ExpoReactNativeFactoryProvider` and let the scene
 *    delegate create the window and start React Native.
 *
 * Remove this plugin after upgrading to an SDK whose template does this itself.
 */
const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

const WINDOW_BLOCK = /\n#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\n\s*factory\.startReactNative\([\s\S]*?\)\n#endif\n/;

function withSceneLifecycle(config) {
  config = withInfoPlist(config, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            // @objc name of ExpoAppSceneDelegate in expo/ios/AppDelegates.
            UISceneDelegateClassName: 'EXExpoAppSceneDelegate',
          },
        ],
      },
    };
    return cfg;
  });

  config = withAppDelegate(config, (cfg) => {
    if (cfg.modResults.language !== 'swift') {
      throw new Error('with-scene-lifecycle: expected a Swift AppDelegate');
    }
    let src = cfg.modResults.contents;
    if (!src.includes('ExpoReactNativeFactoryProvider')) {
      src = src.replace('class AppDelegate: ExpoAppDelegate {', 'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {');
    }
    if (WINDOW_BLOCK.test(src)) {
      src = src.replace(WINDOW_BLOCK, '\n    // The scene delegate creates the window and starts React Native (iOS 27 scene life cycle).\n');
    }
    if (!src.includes('ExpoReactNativeFactoryProvider') || src.includes('UIWindow(frame:')) {
      throw new Error('with-scene-lifecycle: AppDelegate template changed; update the plugin');
    }
    cfg.modResults.contents = src;
    return cfg;
  });

  return config;
}

module.exports = withSceneLifecycle;
