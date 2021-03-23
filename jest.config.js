const setupFile = require('path').resolve(__dirname, './test/test.setup.js');

module.exports = {
  setupFilesAfterEnv: [setupFile],

  collectCoverageFrom: [
    './src/**/*.{js,jsx}',
    '!**/node_modules/**',
  ],

  roots: ['<rootDir>'],

  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],

  bail: true,
  verbose: true,
};
