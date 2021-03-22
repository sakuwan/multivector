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
    // Satisfy p∙p = 1
    const toBeNormalized = Plane(1, 1, 1, 2);

    toBeNormalized.normalize();
    {
      expect(toBeNormalized).toApproxEqualElement([0.5773, 0.5773, 0.5773, 1.1547], 1e-4);

      const innerProduct = PGA.dot(toBeNormalized, toBeNormalized);
      expect(innerProduct).toBeCloseTo(1, 5);
    }

    // Scale values upwards instead of down
    const mixedSigns = Plane(-1, 2, -3, 4);

    mixedSigns.normalize();
    {
      expect(mixedSigns).toApproxEqualElement([-0.2672, 0.5345, -0.8017, 1.0690], 1e-4);

      const innerProduct = PGA.dot(mixedSigns, mixedSigns);
      expect(innerProduct).toBeCloseTo(1, 5);
    }
  });

  it('Performs core element operations: Inversion', () => {
    // Satisfy p∙p⁻¹ = 1
    const toBeInverted = Plane(1, 1, 1, 2);
    toBeInverted.invert();
    {
      expect(toBeInverted).toApproxEqualElement([0.3333, 0.3333, 0.3333, 0.6666], 1e-4);

      const initialP = Plane(1, 1, 1, 2);
      const innerProduct = PGA.dot(initialP, toBeInverted);
      expect(innerProduct).toBeCloseTo(1, 5);
    }
  });
});
