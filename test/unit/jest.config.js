const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,

  name: 'unit',
  displayName: 'mv unit tests',

  testMatch: ['./**/?(*.)+(spec|test).[tj]s?(x)'],
};
