module.exports = {
  root: true,

  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
  },

  env: {
    node: true,
    jest: true,
    browser: true,
  },

  extends: ['airbnb-base'],
  plugins: ['import'],
};
