import integrationConfig from './jest.int-config.js';

const config = {
  ...integrationConfig,
  testRegex: '.*\\.test\\.js$',
  testTimeout: 300000,
};

export default config;
