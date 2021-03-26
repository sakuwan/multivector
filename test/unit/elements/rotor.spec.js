import {
  PGA,
  PGATypes,

  Rotor,
} from '../../../src';

describe('PGA Element - Rotor', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof Rotor).toBe('function');

    // Default rotor, Rotor(0, 0, 0, 1)
    const defaultRotor = Rotor();
    expect(defaultRotor).toEqualElement([0, 0, 0, 1]);

    // Initialize with values, auto-normalization
    const initializedRotor = Rotor(1, 0, 0, Math.PI);
    expect(initializedRotor).toApproxEqualElement([1, 0, 0, 0]);
  });

  it('Has the proper type identifier', () => {
    // Make sure the instance has the proper type
    const defaultRotor = Rotor();

    const rotorType = defaultRotor.type();
    expect(rotorType).toBe(PGATypes.Rotor);
    expect(rotorType).not.toBe(Symbol('Rotor'));
  });

  it('Allows for multivector and component access', () => {
    // (x, y, z, s) -> (1, 2, 3, pi)
    const rotorElement = Rotor(1, 2, 3, Math.PI);

    expect(rotorElement).toApproxEqualElement([
      0.2672, 0.5345, 0.8017, 0,
    ], 1e-4);

    expect(rotorElement.e23).toBeCloseTo(0.2672);
    expect(rotorElement.e31).toBeCloseTo(0.5345);
    expect(rotorElement.e12).toBeCloseTo(0.8017);
    expect(rotorElement.s).toBeCloseTo(0);

    rotorElement.e23 = 4;
    rotorElement.e31 = 3;
    rotorElement.e12 = 2;
    rotorElement.s = 1;

    expect(rotorElement).toEqualElement([4, 3, 2, 1]);
  });

  it('Performs core element operations: Lengths', () => {
    const farRotor = Rotor(10, 10, 10, 5);

    // No components vanish, auto-normalized from Rotor call
    const metricLength = farRotor.length();
    expect(metricLength).toBeCloseTo(1);

    // ||R||∞ = ||T|| (All components vanish)
    const infinityLength = farRotor.infinityLength();
    expect(infinityLength).toBe(0);
  });

  it('Performs core element operations: Normalization', () => {
    const toBeNormalized = Rotor(1, 2, 3, Math.PI);

    // Satisfy R * ∼R = 1, auto-normalized, so redundant
    toBeNormalized.normalize();
    {
      expect(toBeNormalized).toApproxEqualElement([
        0.2672, 0.5345, 0.8017, 0,
      ], 1e-4);

      const innerProduct = PGA.mul(toBeNormalized, toBeNormalized.reversed());
      expect(innerProduct.s).toBe(1);
    }

    // Less than one scaling
    const decimalNormalized = Rotor(0.3, 0.6, 0.9, Math.PI);

    // Auto-normalized, so redundant
    decimalNormalized.normalize();
    {
      expect(decimalNormalized).toApproxEqualElement([
        0.2672, 0.5345, 0.8017, 0,
      ], 1e-4);

      const innerProduct = PGA.mul(decimalNormalized, decimalNormalized.reversed());
      expect(innerProduct.s).toBe(1);
    }

    // Mixed signs
    const mixedNormalized = Rotor(1, -2, 3, Math.PI);

    // Auto-normalized, so redundant
    mixedNormalized.normalize();
    {
      expect(mixedNormalized).toApproxEqualElement([
        0.2672, -0.5345, 0.8017, 0,
      ], 1e-4);

      const innerProduct = PGA.mul(mixedNormalized, mixedNormalized.reversed());
      expect(innerProduct.s).toBe(1);
    }

    // Already normalized, so skip the normalize call
    const alreadyNormalized = Rotor(1, 2, 3, Math.PI);

    {
      expect(alreadyNormalized).toApproxEqualElement([
        0.2672, 0.5345, 0.8017, 0,
      ], 1e-4);

      const innerProduct = PGA.mul(alreadyNormalized, alreadyNormalized.reversed());
      expect(innerProduct.s).toBe(1);
    }
  });

  it('Performs core element operations: Inversion', () => {
    const toBeInverted = Rotor(1, 2, 3, Math.PI);

    // Satisfy R * R⁻¹ = 1
    toBeInverted.invert();
    {
      expect(toBeInverted).toApproxEqualElement([
        -0.2672, -0.5345, -0.8017, 0,
      ], 1e-4);

      const originalRotor = Rotor(1, 2, 3, Math.PI);

      const innerProduct = PGA.mul(originalRotor, toBeInverted);
      expect(innerProduct.s).toBe(1);
    }

    // Less than one scaling
    const decimalInverted = Rotor(0.3, 0.6, 0.9, Math.PI);

    decimalInverted.invert();
    {
      expect(decimalInverted).toApproxEqualElement([
        -0.2672, -0.5345, -0.8017, 0,
      ], 1e-4);

      const originalRotor = Rotor(0.3, 0.6, 0.9, Math.PI);

      const innerProduct = PGA.mul(originalRotor, decimalInverted);
      expect(innerProduct.s).toBe(1);
    }

    // Mixed signs
    const mixedInverted = Rotor(1, -2, 3, Math.PI);

    mixedInverted.invert();
    {
      expect(mixedInverted).toApproxEqualElement([
        -0.2672, 0.5345, -0.8017, 0,
      ], 1e-4);

      const originalRotor = Rotor(1, -2, 3, Math.PI);

      const innerProduct = PGA.mul(originalRotor, mixedInverted);
      expect(innerProduct.s).toBe(1);
    }

    // Inversion flips signs for all grade-2 elements
    const alreadyInverted = Rotor(1, 0, 0, Math.PI);

    alreadyInverted.invert();
    {
      expect(alreadyInverted).toApproxEqualElement([-1, 0, 0, 0]);

      const originalRotor = Rotor(1, 0, 0, Math.PI);

      const innerProduct = PGA.mul(originalRotor, alreadyInverted);
      expect(innerProduct.s).toBe(1);
    }
  });
});
