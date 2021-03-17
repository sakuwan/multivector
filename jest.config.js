module.exports = {
  setupFilesAfterEnv: ['jest-extended'],
  collectCoverageFrom: [
    './src/**/*.{js,jsx}',
    '!**/node_modules/**',
  ],

  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],

  bail: true,
  verbose: true,
};
