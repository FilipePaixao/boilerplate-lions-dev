import path from 'path';
import { fileURLToPath } from 'url';

process.env.TZ = 'UTC';

const TWENTY_SECONDS_OF_TIMEOUT = 20000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  moduleFileExtensions: ['js', 'json'],
  rootDir: '../src',
  bail: 1,
  testRegex: '.*\\.unit.test\\.js$ ',
  setupFiles: ['../jest/setup-tests.cjs'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': [
      'babel-jest',
      { configFile: path.resolve(__dirname, '../babel.config.cjs') },
    ],
  },
  collectCoverageFrom: ['**/*.js', '!**/test/**'],
  coveragePathIgnorePatterns: [
    '/src/server.js',
    '/src/__tests__',
    '/src/constants.js',
  ],
  coverageDirectory: '../coverage/unit',
  testTimeout: TWENTY_SECONDS_OF_TIMEOUT,
};

export default config;
