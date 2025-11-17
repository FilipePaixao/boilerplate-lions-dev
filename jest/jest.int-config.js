import defaultConfig from './jest.config.js';

const config = {
  ...defaultConfig,
  testRegex: '.*\\.int.test\\.js$',
  coverageDirectory: '../coverage/int',
  setupFiles: [...(defaultConfig.setupFiles || [])],
  setupFilesAfterEnv: ['../jest/setup-integration-tests.cjs'],
};

export default config;
