import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isProd = process.env.NODE_ENV !== 'development';
const toOutputFile = (file) => `dist/${file.match(/(?<=\/)[^/]*(?=\.\w+$)/i)}`;

const babelPlugin = babel({
  babelHelpers: 'runtime',
});

const terserPlugin = terser(
  // TODO: Terser opts, see what compression & mangling are viable
);

const generateConfig = (file) => {
  const outputFile = toOutputFile(file);
  const plugins = [
    resolve(),
    commonjs(),
    json(),

    babelPlugin,
    ...(isProd ? [terserPlugin] : []),
  ];

  return {
    input: file,
    output: [{
      file: `${outputFile}${isProd ? '.esm.min.js' : '.esm.js'}`,
      format: 'esm',
      ...(isProd ? null : { sourcemap: 'inline' }),
    }, {
      file: `${outputFile}${isProd ? '.cjs.min.js' : '.cjs.js'}`,
      format: 'cjs',
      exports: 'auto',
      ...(isProd ? null : { sourcemap: 'inline' }),
    }],
    external: [/@babel\/runtime/],
    plugins,
  };
};

export default [
  generateConfig('src/index.js'),
];
