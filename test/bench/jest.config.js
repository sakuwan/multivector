const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,

  name: 'benchmark',
  displayName: 'mv benchmark tests',

  testMatch: ['./**/?(*.)+(spec|test).[tj]s?(x)'],
};
