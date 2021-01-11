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

  /*
   * I don't particularly want to do this, so per-file it is.
  rules: {
    'no-param-reassign': [2, { props: false }],
  },
  */
};
