import {
  PGA,
  PGATypes,

  Plane,
} from '../../../src';

describe('PGA element - Plane', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof Plane).toBe('function');

    // Default plane, Plane(0, 0, 0, 0)
    const defaultPlane = Plane();
    expect(defaultPlane).toEqualElement([0, 0, 0, 0]);

    // Initialize with values
    const initializedPlane = Plane(1, 2, 3, 4);
    expect(initializedPlane).toEqualElement([1, 2, 3, 4]);
  });

  it('Has the proper type identifier', () => {
    // Make sure the instance has the proper type
    const defaultPlane = Plane();

    const planeType = defaultPlane.type();
    expect(planeType).toBe(PGATypes.Plane);
    expect(planeType).not.toBe(Symbol('Plane'));
  });

  it('Allows for multivector and component access', () => {
    // (a, b, c, d) -> (1, 2, 3, 4)
    const planeElement = Plane(1, 2, 3, 4);

    expect(planeElement).toEqualElement([1, 2, 3, 4]);

    expect(planeElement.e1).toBe(1);
    expect(planeElement.e2).toBe(2);
    expect(planeElement.e3).toBe(3);
    expect(planeElement.e0).toBe(4);

    planeElement.e1 = 4;
    planeElement.e2 = 3;
    planeElement.e3 = 2;
    planeElement.e0 = 1;

    expect(planeElement).toEqualElement([4, 3, 2, 1]);
  });

  it('Performs core element operations: Lengths', () => {
    // e0 squares to zero and vanishes
    const farPoint = Plane(10, 10, 10, 5);

    const metricLength = farPoint.length();
    expect(metricLength).toBeCloseTo(17.3205);

    // ||p||∞ = ||P||
    const infinityLength = farPoint.infinityLength();
    expect(infinityLength).toBe(5);
  });

  it('Performs core element operations: Normalization', () => {
    const toBeNormalized = Plane(1, 1, 1, 2);

    // Satisfy p∙p = 1
    toBeNormalized.normalize();
    {
      expect(toBeNormalized).toApproxEqualElement([
        0.5773, 0.5773, 0.5773, 1.1547,
      ], 1e-4);

      const innerProduct = PGA.dot(toBeNormalized, toBeNormalized);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Less than one scaling
    const decimalNormalized = Plane(0.25, 0.5, 0.75, 1);

    decimalNormalized.normalize();
    {
      expect(decimalNormalized).toApproxEqualElement([
        0.2672, 0.5345, 0.8017, 1.0690,
      ], 1e-4);

      const innerProduct = PGA.dot(decimalNormalized, decimalNormalized);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Mixed signs
    const mixedNormalized = Plane(-1, 2, -3, 4);

    mixedNormalized.normalize();
    {
      expect(mixedNormalized).toApproxEqualElement([
        -0.2672, 0.5345, -0.8017, 1.0690,
      ], 1e-4);

      const innerProduct = PGA.dot(mixedNormalized, mixedNormalized);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Already normalized
    const alreadyNormalized = Plane(1, 0, 0, 0);

    alreadyNormalized.normalize();
    {
      expect(alreadyNormalized).toEqualElement([1, 0, 0, 0]);

      const innerProduct = PGA.dot(alreadyNormalized, alreadyNormalized);
      expect(innerProduct).toBeCloseTo(1);
    }
  });

  it('Performs core element operations: Inversion', () => {
    const toBeInverted = Plane(1, 1, 1, 2);

    // Satisfy p∙p⁻¹ = 1
    toBeInverted.invert();
    {
      expect(toBeInverted).toApproxEqualElement([
        0.3333, 0.3333, 0.3333, 0.6666,
      ], 1e-4);

      const originalPlane = Plane(1, 1, 1, 2);
      const innerProduct = PGA.dot(originalPlane, toBeInverted);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Less than one scaling
    const decimalInverted = Plane(0.25, 0.5, 0.75, 1);

    decimalInverted.invert();
    {
      expect(decimalInverted).toApproxEqualElement([
        0.2857, 0.5714, 0.8571, 1.1428,
      ], 1e-4);

      const originalPlane = Plane(0.25, 0.5, 0.75, 1);
      const innerProduct = PGA.dot(originalPlane, decimalInverted);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Mixed signs
    const mixedInverted = Plane(-1, 2, -3, 4);

    mixedInverted.invert();
    {
      expect(mixedInverted).toApproxEqualElement([
        -0.0714, 0.1428, -0.2142, 0.2857,
      ], 1e-4);

      const originalPlane = Plane(-1, 2, -3, 4);
      const innerProduct = PGA.dot(originalPlane, mixedInverted);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Already inverted
    const alreadyInverted = Plane(1, 0, 0, 0);

    alreadyInverted.invert();
    {
      expect(alreadyInverted).toEqualElement([1, 0, 0, 0]);

      const originalPlane = Plane(1, 0, 0, 0);
      const innerProduct = PGA.dot(originalPlane, alreadyInverted);
      expect(innerProduct).toBeCloseTo(1);
    }
  });
});
