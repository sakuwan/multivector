import * as MVMath from '../../src/math';

describe('Math', () => {
  it('Unary math operations', () => {
    const v1 = new Float32Array([1, 2, 3, 4]);

    MVMath.addScalar(5, v1);
    expect(v1).toEqual(new Float32Array([6, 7, 8, 9]));

    MVMath.subScalar(5, v1);
    expect(v1).toEqual(new Float32Array([1, 2, 3, 4]));

    MVMath.mulScalar(2, v1);
    expect(v1).toEqual(new Float32Array([2, 4, 6, 8]));

    MVMath.divScalar(2, v1);
    expect(v1).toEqual(new Float32Array([1, 2, 3, 4]));
  });
});
