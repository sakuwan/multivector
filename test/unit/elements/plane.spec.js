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
    expect(defaultPlane.buffer).toEqual(new Float32Array([0, 0, 0, 0]));

    // Initialize with values
    const initializedPlane = Plane(1, 2, 3, 4);
    expect(initializedPlane.buffer).toEqual(new Float32Array([1, 2, 3, 4]));

    // Cloning, verify unique instances
    const clonedPlane = defaultPlane.clone();
    expect(clonedPlane.buffer).toEqual(new Float32Array([0, 0, 0, 0]));
    expect(clonedPlane.buffer).not.toBe(defaultPlane.buffer);

    clonedPlane.buffer[0] = 1;
    expect(defaultPlane.buffer[0]).toBe(0);
  });

  it('Has the proper type identifier', () => {
    // Make sure the instance has the proper type
    const defaultPlane = Plane();

    const planeType = defaultPlane.type();
    expect(planeType).toBe(PGATypes.Plane);
    expect(planeType).not.toBe(Symbol('Plane'));
  });

  it('Performs core element operations: Normalization', () => {
    // Satisfy p∙p = 1
    const toBeNormalized = Plane(1, 1, 1, 2);

    toBeNormalized.normalize();
    {
      const [e1, e2, e3, e0] = toBeNormalized.buffer;
      expect(e1).toBeCloseTo(0.5773);
      expect(e2).toBeCloseTo(0.5773);
      expect(e3).toBeCloseTo(0.5773);
      expect(e0).toBeCloseTo(1.1547);

      const innerProduct = PGA.dot(toBeNormalized, toBeNormalized);
      expect(innerProduct).toBeCloseTo(1, 5);
    }

    // Scale values upwards instead of down
    const mixedSigns = Plane(-1, 2, -3, 4);

    mixedSigns.normalize();
    {
      const [e1, e2, e3, e0] = mixedSigns.buffer;
      expect(e1).toBeCloseTo(-0.2672);
      expect(e2).toBeCloseTo(0.5345);
      expect(e3).toBeCloseTo(-0.8017);
      expect(e0).toBeCloseTo(1.0690);

      const innerProduct = PGA.dot(mixedSigns, mixedSigns);
      expect(innerProduct).toBeCloseTo(1, 5);
    }
  });

  it('Performs core element operations: Inversion', () => {
    // Satisfy p∙p⁻¹ = 1
    const toBeInverted = Plane(1, 1, 1, 2);
    toBeInverted.invert();
    {
      const [e1, e2, e3, e0] = toBeInverted.buffer;
      expect(e1).toBeCloseTo(0.333);
      expect(e2).toBeCloseTo(0.333);
      expect(e3).toBeCloseTo(0.333);
      expect(e0).toBeCloseTo(0.666);

      const initialP = Plane(1, 1, 1, 2);
      const innerProduct = PGA.dot(initialP, toBeInverted);
      expect(innerProduct).toBeCloseTo(1, 5);
    }
  });
});
