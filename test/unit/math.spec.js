import * as MVMath from '../../src/math';

describe('Math', () => {
  it('Basic math operations', () => {
    const v1 = new Float32Array([1, 2, 3, 4]);

    MVMath.addScalar(v1, 5);
    expect(v1).toEqual(new Float32Array([6, 7, 8, 9]));

    MVMath.subScalar(v1, 5);
    expect(v1).toEqual(new Float32Array([1, 2, 3, 4]));

    MVMath.mulScalar(v1, 2);
    expect(v1).toEqual(new Float32Array([2, 4, 6, 8]));

    MVMath.divScalar(v1, 2);
    expect(v1).toEqual(new Float32Array([1, 2, 3, 4]));
  });
});
