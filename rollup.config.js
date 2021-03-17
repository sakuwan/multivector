import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import { terser } from 'rollup-plugin-terser';

import * as pkgConfig from './package.json';

const isProd = process.env.NODE_ENV !== 'development';

const babelPlugin = babel({
  babelHelpers: 'runtime',
});

const terserPlugin = terser({
  ecma: 2020,
});

const generateConfig = (file) => {
  const plugins = [
    resolve(),
    commonjs(),

    babelPlugin,
    ...(isProd ? [terserPlugin] : []),
  ];

  return {
    input: file,

    output: [{
      file: `./dist/${pkgConfig.name}${isProd ? '.esm.min.js' : '.esm.js'}`,
      format: 'esm',

      ...(isProd ? null : { sourcemap: 'inline' }),
    }, {
      file: `./dist/${pkgConfig.name}${isProd ? '.cjs.min.js' : '.cjs.js'}`,
      format: 'cjs',
      exports: 'auto',

      ...(isProd ? null : { sourcemap: 'inline' }),
    }],

    plugins,
  };
};

export default [
  generateConfig(pkgConfig.main),
];
