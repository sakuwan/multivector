/* eslint-disable */

import assert from 'assert';

import {
  mvec2, mvec3, mvec4
} from '../src/vector';

const eq = (...args) => {
  assert.strictEqual(args.length, 2);

  const actual = JSON.stringify(args[0]);
  const expected = JSON.stringify(args[1]);

  assert.strictEqual(actual, expected);
};

describe('multivector', function () {
  it('Properly initializes from provided values', function () {
    const v1 = mvec4([1, 2, 3, 4]);
    eq(v1.buffer, new Float32Array([1, 2, 3, 4]));

    const v3 = mvec3([1, 2, 3]);
    eq(v3.buffer, new Float32Array([1, 2, 3]));

    let v2 = mvec2(5, 6);
    eq(v2.buffer, new Float32Array([5, 6]));

    let v1_1 = mvec4(...v1);
    v1_1.xyz = [6, 5, 4];
    eq(v1_1.buffer, new Float32Array([6, 5, 4, 4]));
  });

  // TODO: Actual benchmarks to see the significance of the Proxy hit; likely large
});