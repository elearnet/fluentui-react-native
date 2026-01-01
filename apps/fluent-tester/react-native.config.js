const path = require('path');
const project = (() => {
  try {
    const { configureProjects } = require('react-native-test-app');
    return configureProjects({
      android: {
        sourceDir: 'android',
      },
      ios: {
        sourceDir: 'ios',
      },
      macos: {
        sourceDir: 'macos',
      },
      windows: {
        sourceDir: 'windows',
        solutionFile: 'windows/FluentTester.sln',
      },
    });
  } catch (_) {
    return undefined;
  }
})();

module.exports = {
  ...(project ? { project } : undefined),
  dependencies: {
    "elui-native": {
      root: path.resolve(__dirname, '../../packages/el/elui-native'),
    },
    etest: {
      root: path.resolve(__dirname, '../../packages/el/etest'),
    },
  },
};
