/* eslint-disable */

import {
  cvec2, cvec3, cvec4,
} from '../../src/vector';

describe('ComponentVector', () => {
  it('Properly initializes from provided values', () => {
    const v1 = cvec2([1, 2]);
    expect(v1.size).toEqual(2);
    expect(v1.buffer).toEqual(new Float32Array([1, 2]));

    const v2 = cvec3([1, 2, 3]);
    expect(v2.size).toEqual(3);
    expect(v2.buffer).toEqual(new Float32Array([1, 2, 3]));

    const v3 = cvec4([1, 2, 3, 4]);
    expect(v3.size).toEqual(4);
    expect(v3.buffer).toEqual(new Float32Array([1, 2, 3, 4]));
  });

  it('Cycles values when length is larger than provided values', () => {
    const v1 = cvec2(1);
    expect(v1.size).toEqual(2);
    expect(v1.buffer).toEqual(new Float32Array([1, 1]));

    const v2 = cvec3([1, 2]);
    expect(v2.size).toEqual(3);
    expect(v2.buffer).toEqual(new Float32Array([1, 2, 1]));

    const v3 = cvec4(-1, 5);
    expect(v3.size).toEqual(4);
    expect(v3.buffer).toEqual(new Float32Array([-1, 5, -1, 5]));
  });

  it('Swizzle getters return proper components and ComponentVectors', () => {
    const v1 = cvec4(1, 2, 3, 4);

    const v2 = v1.xyz;
    expect(v2.buffer).toEqual(new Float32Array([1, 2, 3]));

    const v3 = v2.xxx;
    expect(v3.buffer).toEqual(new Float32Array([1, 1, 1]));

    const v4 = v1.wzyx;
    expect(v4.buffer).toEqual(new Float32Array([4, 3, 2, 1]));

    const x = v4.x;
    expect(x).toEqual(4);
  });

  it('Swizzle getters are separate instances and hold no references', () => {
    const v1 = cvec4(1, 2, 3, 4);

    const v2 = v1.xyz;
    expect(v2.buffer).toEqual(new Float32Array([1, 2, 3]));

    v2.fill(0);
    expect(v2.buffer).toEqual(new Float32Array([0, 0, 0]));
    expect(v1.buffer).toEqual(new Float32Array([1, 2, 3, 4]));
  });

  it('Swizzle setters assign proper values', () => {
    const v1 = cvec4(1, 2, 3, 4);

    v1.x = 5;
    expect(v1.buffer).toEqual(new Float32Array([5, 2, 3, 4]));

    v1.xxx = 1;
    expect(v1.buffer).toEqual(new Float32Array([1, 2, 3, 4]));

    v1.xyz = [-1, -2, -3];
    expect(v1.buffer).toEqual(new Float32Array([-1, -2, -3, 4]));

    v1.xyzw = [5, 4];
    expect(v1.buffer).toEqual(new Float32Array([5, 4, 5, 4]));
  });
});