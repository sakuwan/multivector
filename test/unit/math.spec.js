import Point from '../../src/math/PGA/Point';

describe('PGA elements', () => {
  it('Initializes a proper Point element', () => {
    // Export is a light factory wrapper around new
    expect(typeof Point).toBe('function');

    // Default point, Point(0, 0, 0, 1)
    const defaultPoint = Point();
    expect(defaultPoint.buffer).toEqual(new Float32Array([0, 0, 0, 1]));

    // Initialize with values
    const initializedPoint = Point(1, 2, 3, 4);
    expect(initializedPoint.buffer).toEqual(new Float32Array([1, 2, 3, 4]));

    // Cloning, verify unique instances
    const clonedPoint = defaultPoint.clone();
    expect(clonedPoint.buffer).toEqual(new Float32Array([0, 0, 0, 1]));
    expect(clonedPoint.buffer).not.toBe(defaultPoint.buffer);

    clonedPoint.buffer[0] = 1;
    expect(defaultPoint.buffer[0]).toBe(0);
  });

  it('Performs core point element operations', () => {
    // Satisfy X^2 = +-1, the homogenous coordinate should be of weight 1
    const toBeNormalized = Point(1, 1, 1, 2);

    toBeNormalized.normalize();
    expect(toBeNormalized.buffer).toEqual(new Float32Array([0.5, 0.5, 0.5, 1]));

    const alreadyNormalized = Point(1, 1, 1, 1);

    alreadyNormalized.normalize();
    expect(alreadyNormalized.buffer).toEqual(new Float32Array([1, 1, 1, 1]));
  });
});
