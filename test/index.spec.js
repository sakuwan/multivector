/**
 * @jest-environment node
 */

/* eslint-disable */

import assert from 'assert';

import {
  mvec2, mvec3, mvec4
} from '../src/swizzle';

const eq = (...args) => {
  assert.strictEqual(args.length, 2);

  const actual = JSON.stringify(args[0]);
  const expected = JSON.stringify(args[1]);

  assert.strictEqual(actual, expected);
};

describe('unit', function () {
  it('Properly initializes from provided values', function () {
    const v1 = mvec4([1, 2, 3, 4]);
    eq(v1.buffer, new Float32Array([1, 2, 3, 4]));

    const v3 = mvec3([1, 2, 3]);
    eq(v3.buffer, new Float32Array([1, 2, 3]));

    let v2 = mvec2(5, 6);
    eq(v2.buffer, new Float32Array([5, 6]));

    let v1_1 = mvec4(...v1);
    v1_1.xwz = [6, 5, 4];
    eq(v1_1.buffer, new Float32Array([6, 2, 4, 5]));

    let x = v1_1.reduce((a, c) => a + c);
    eq(x, 17);

    const testFn = v1_1.every((v) => v > 0);
    eq(testFn, true);

    const testFn2 = v1_1.some((v) => v === 6);
    eq(testFn2, true);

    v1_1.fill(0);
    eq(v1_1.buffer, new Float32Array([0, 0, 0, 0]));

    let length = +mvec4(1, -3, 3, 1);
    console.log(v1_1);
  });

  // TODO: Actual benchmarks to see the significance of the Proxy hit; likely large
});