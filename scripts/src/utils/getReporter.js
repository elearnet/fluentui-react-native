import { createReporter } from '@rnx-kit/reporter';

const reporter = createReporter({
  name: 'fluentui-scripts reporter',
  packageName: '@elui-react-native/scripts',
});

/**
 * Get the reporter instance for logging.
 * @returns {import('@rnx-kit/reporter').Reporter} The reporter instance.
 */
export function getReporter() {
  return reporter;
}
