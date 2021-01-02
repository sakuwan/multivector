module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: 3,
    }],
  ],

  plugins: [
    '@babel/plugin-transform-runtime',

    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],

  exclude: [
    '/node_modules/',
    /(\/|\\)core-js(\/|\\)/,
  ],

  comments: true,
};
