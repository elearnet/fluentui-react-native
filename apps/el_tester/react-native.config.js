const path = require('path');

module.exports = {
  project: {
    ios: {
      sourceDir: './ios',
        automaticPodsInstallation: true,
    },
    macos: {
        automaticPodsInstallation: true,
      sourceDir: './macos',
    },
  },
  //hoisting native modules, codegen couldn't find them in el_tester/node_modules
  //have to tell codegen where to find them
  dependencies: {
    elui: {
      root: path.resolve(__dirname, '../../packages/el/elui'),
    },
    etest: {
      root: path.resolve(__dirname, '../../packages/el/etest'),
    },
    '@elui-react-native/callout': {
      root: path.resolve(__dirname, '../../packages/components/Callout'),
    },
  },
};
