const path = require('path');

module.exports = {
  project: {
    ios: {
      sourceDir: './ios',
        automaticPodsInstallation: true,
    },
    macos: {
        automaticPodsInstallation: true,
      sourceDir: './macos'
    },
  },
  //hoisting native modules, codegen couldn't find them in el_tester/node_modules
  //have to tell codegen where to find them
  dependencies: {
    "elui-native": {
      root: path.resolve(__dirname, '../../packages/el/elui-native'),
    },
    etest: {
      root: path.resolve(__dirname, '../../packages/el/etest'),
    },
    '@elui-react-native/callout': {
      root: path.resolve(__dirname, '../../packages/components/Callout'),
    },
    '@elui-react-native/focus-zone': {
      root: path.resolve(__dirname, '../../packages/components/FocusZone'),
    },
    // '@elui-react-native/contextual-menu': {
    //   root: path.resolve(__dirname, '../../packages/components/ContextualMenu'),
    // },
  },
};
