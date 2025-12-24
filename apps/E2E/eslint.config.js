const baseConfig = require('@elui-react-native/eslint-config-rules');

module.exports = [
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
    },
  },
];
