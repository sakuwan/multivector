import Point from '../../src/math/PGA/Point';
import PGATypes from '../../src/math/PGA/types';

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

  it('Has the proper type identifier', () => {
    // Make sure the instance has the proper type
    const defaultPoint = Point();

    const pointType = defaultPoint.type();
    expect(pointType).toBe(PGATypes.Point);
    expect(pointType).not.toBe(Symbol('Point'));
  });

  it('Allows for multivector and component access', () => {
    // (x, y, z, w) -> (1, 2, 3, 4)
    const pointElement = Point(1, 2, 3, 4);

    expect(pointElement.mv()).toEqual(new Float32Array([1, 2, 3, 4]));

    expect(pointElement.x()).toBe(1);
    expect(pointElement.y()).toBe(2);
    expect(pointElement.z()).toBe(3);
    expect(pointElement.w()).toBe(4);

    expect(pointElement.e032()).toBe(1);
    expect(pointElement.e013()).toBe(2);
    expect(pointElement.e021()).toBe(3);
    expect(pointElement.e123()).toBe(4);

    pointElement.setX(4);
    pointElement.setY(3);
    pointElement.setZ(2);
    pointElement.setW(1);

    expect(pointElement.mv()).toEqual(new Float32Array([4, 3, 2, 1]));
  });

  it('Performs core point element operations: Lengths', () => {
    // Metric will simply be e123
    const farPoint = Point(10, 10, 10, 5);

    const metricLength = farPoint.metricLength();
    expect(metricLength).toBe(5);

    const euclideanLength = farPoint.length();
    expect(euclideanLength).toBeCloseTo(18.0277);
  });

  it('Performs core point element operations: Normalization', () => {
    // Satisfy X^2 = +-1, the homogeneous coordinate should be of weight 1
    const toBeNormalized = Point(1, 1, 1, 2);

    toBeNormalized.normalize();
    expect(toBeNormalized.buffer).toEqual(new Float32Array([0.5, 0.5, 0.5, 1]));

    // Already normalized
    const alreadyNormalized = Point(1, 1, 1, 1);

    alreadyNormalized.normalize();
    expect(alreadyNormalized.buffer).toEqual(new Float32Array([1, 1, 1, 1]));

    // Scale values upwards instead of down
    const belowOne = Point(1, 1, 1, 0.5);

    belowOne.normalize();
    expect(belowOne.buffer).toEqual(new Float32Array([2, 2, 2, 1]));
  });

  it('Performs core point element operations: Inversion', () => {
    // Satisfy X * Xinv = X^2 = +-1
    const toBeInverted = Point(1, 1, 1, 2);

    toBeInverted.invert();
    expect(toBeInverted.buffer).toEqual(new Float32Array([0.25, 0.25, 0.25, 0.5]));

    // No inverse
    const noInverse = Point(1, 1, 1, 1);

    noInverse.invert();
    expect(noInverse.buffer).toEqual(new Float32Array([1, 1, 1, 1]));

    // Scale values upwards instead of down
    const belowOne = Point(1, 1, 1, 0.5);

    belowOne.invert();
    expect(belowOne.buffer).toEqual(new Float32Array([4, 4, 4, 2]));

    // Ensure negatives are fine
    const negativeInvert = Point(-1, -2, -3, -10);

    negativeInvert.invert();
    expect(negativeInvert.x()).toBeCloseTo(-0.01);
    expect(negativeInvert.y()).toBeCloseTo(-0.02);
    expect(negativeInvert.z()).toBeCloseTo(-0.03);
    expect(negativeInvert.w()).toBeCloseTo(-0.1);
  });

  it('Performs core point element operations: Reversion', () => {
    // Reversion of grade 3 k-vectors is simply a sign flip
    const toBeReversed = Point(1, -2, 3, -1);

    toBeReversed.reverse();
    expect(toBeReversed.buffer).toEqual(new Float32Array([-1, 2, -3, 1]));
  });

  it('Performs core point element operations: Conjugation', () => {
    // There is no conjugate for this multivector, so expect a no-op
    const noConjugate = Point(1, 2, 3, 4);

    noConjugate.conjugate();
    expect(noConjugate.buffer).toEqual(new Float32Array([1, 2, 3, 4]));
  });
});
