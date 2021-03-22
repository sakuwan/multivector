import {
  PGATypes,

  Point,
} from '../../../src';

describe('PGA element - Point', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof Point).toBe('function');

    // Default point, Point(0, 0, 0, 1)
    const defaultPoint = Point();
    expect(defaultPoint).toEqualElement([0, 0, 0, 1]);

    // Initialize with values
    const initializedPoint = Point(1, 2, 3, 4);
    expect(initializedPoint).toEqualElement([1, 2, 3, 4]);
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

    expect(pointElement).toEqualElement([1, 2, 3, 4]);

    expect(pointElement.e032).toBe(1);
    expect(pointElement.e013).toBe(2);
    expect(pointElement.e021).toBe(3);
    expect(pointElement.e123).toBe(4);

    pointElement.e032 = 4;
    pointElement.e013 = 3;
    pointElement.e021 = 2;
    pointElement.e123 = 1;

    expect(pointElement).toEqualElement([4, 3, 2, 1]);
  });

  it('Performs core element operations: Lengths', () => {
    // e0 squares to zero, e123 remains
    const farPoint = Point(10, 10, 10, 5);

    const metricLength = farPoint.length();
    expect(metricLength).toBe(5);

    // ||P||∞ = ||p||
    const infinityLength = farPoint.infinityLength();
    expect(infinityLength).toBeCloseTo(17.3205);
  });

  it('Performs core element operations: Normalization', () => {
    // Satisfy P∙P = +-1, the homogeneous coordinate should be of weight 1
    const toBeNormalized = Point(1, 1, 1, 2);

    toBeNormalized.normalize();
    expect(toBeNormalized).toEqualElement([0.5, 0.5, 0.5, 1]);

    // Already normalized
    const alreadyNormalized = Point(1, 1, 1, 1);

    alreadyNormalized.normalize();
    expect(alreadyNormalized).toEqualElement([1, 1, 1, 1]);

    // Scale values upwards instead of down
    const belowOne = Point(1, 1, 1, 0.5);

    belowOne.normalize();
    expect(belowOne).toEqualElement([2, 2, 2, 1]);
  });

  it('Performs core element operations: Inversion', () => {
    // Satisfy P∙P⁻¹ = P∙P = +-1
    const toBeInverted = Point(1, 1, 1, 2);

    toBeInverted.invert();
    expect(toBeInverted).toEqualElement([0.25, 0.25, 0.25, 0.5]);

    // No inverse
    const noInverse = Point(1, 1, 1, 1);

    noInverse.invert();
    expect(noInverse).toEqualElement([1, 1, 1, 1]);

    // Scale values upwards instead of down
    const belowOne = Point(1, 1, 1, 0.5);

    belowOne.invert();
    expect(belowOne).toEqualElement([4, 4, 4, 2]);

    // Ensure negatives are fine
    const negativeInvert = Point(-1, -2, -3, -10);

    negativeInvert.invert();
    expect(negativeInvert).toApproxEqualElement([-0.01, -0.02, -0.03, -0.1]);
  });
});
