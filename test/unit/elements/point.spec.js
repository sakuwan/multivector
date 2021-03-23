import {
  PGA,
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
    const toBeNormalized = Point(1, 1, 1, 2);

    // Satisfy P∙P = +-1, the homogeneous coordinate should be of weight 1
    toBeNormalized.normalize();
    {
      expect(toBeNormalized).toEqualElement([0.5, 0.5, 0.5, 1]);

      const innerProduct = PGA.dot(toBeNormalized, toBeNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Less than one scaling
    const decimalNormalized = Point(1, 1, 1, 0.5);

    decimalNormalized.normalize();
    {
      expect(decimalNormalized).toEqualElement([2, 2, 2, 1]);

      const innerProduct = PGA.dot(decimalNormalized, decimalNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Mixed signs
    const mixedNormalized = Point(-1, 2, -3, 4);

    mixedNormalized.normalize();
    {
      expect(mixedNormalized).toEqualElement([-0.25, 0.5, -0.75, 1]);

      const innerProduct = PGA.dot(mixedNormalized, mixedNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Already normalized
    const alreadyNormalized = Point(1, 1, 1, 1);

    alreadyNormalized.normalize();
    {
      expect(alreadyNormalized).toEqualElement([1, 1, 1, 1]);

      const innerProduct = PGA.dot(alreadyNormalized, alreadyNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }
  });

  it('Performs core element operations: Inversion', () => {
    const toBeInverted = Point(1, 1, 1, 2);

    // Satisfy P∙P⁻¹ = P∙P = +-1
    toBeInverted.invert();
    {
      expect(toBeInverted).toEqualElement([0.25, 0.25, 0.25, 0.5]);

      const originalPoint = Point(1, 1, 1, 2);
      const innerProduct = PGA.dot(originalPoint, toBeInverted);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Less than one scaling
    const decimalInverted = Point(1, 1, 1, 0.5);

    decimalInverted.invert();
    {
      expect(decimalInverted).toEqualElement([4, 4, 4, 2]);

      const originalPoint = Point(1, 1, 1, 0.5);
      const innerProduct = PGA.dot(originalPoint, decimalInverted);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Mixed signs
    const mixedInverted = Point(-1, 2, -3, 4);

    mixedInverted.invert();
    {
      expect(mixedInverted).toApproxEqualElement([-0.0625, 0.125, -0.1875, 0.25]);

      const originalPoint = Point(-1, 2, -3, 4);
      const innerProduct = PGA.dot(originalPoint, mixedInverted);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Already inverted
    const alreadyInverted = Point(1, 1, 1, 1);

    alreadyInverted.invert();
    {
      expect(alreadyInverted).toEqualElement([1, 1, 1, 1]);

      const originalPoint = Point(1, 1, 1, 1);
      const innerProduct = PGA.dot(originalPoint, alreadyInverted);
      expect(innerProduct).toBeCloseTo(-1);
    }
  });
});
