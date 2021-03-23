import {
  PGA,
  PGATypes,

  Line,
} from '../../../src';

describe('PGA Element - Line', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof Line).toBe('function');

    // Default line, Line(0, 0, 0, 0, 0, 0)
    const defaultLine = Line();
    expect(defaultLine).toEqualElement([0, 0, 0, 0, 0, 0, 0, 0]);

    // Initialize with values
    const initializedLine = Line(1, 2, 3, 4, 5, 6);
    expect(initializedLine).toEqualElement([1, 2, 3, 0, 4, 5, 6, 0]);
  });

  it('Has the proper type identifier', () => {
    // Make sure the instance has the proper type
    const defaultLine = Line();

    const lineType = defaultLine.type();
    expect(lineType).toBe(PGATypes.Line);
    expect(lineType).not.toBe(Symbol('Line'));
  });

  it('Allows for multivector and component access', () => {
    // (a, b, c, d, f, g) -> (1, 2, 3, 0, 4, 5, 6, 0)
    const lineElement = Line(1, 2, 3, 4, 5, 6);

    expect(lineElement).toEqualElement([1, 2, 3, 0, 4, 5, 6, 0]);

    expect(lineElement.e01).toBe(1);
    expect(lineElement.e02).toBe(2);
    expect(lineElement.e03).toBe(3);
    expect(lineElement.e0123).toBe(0);

    expect(lineElement.e23).toBe(4);
    expect(lineElement.e31).toBe(5);
    expect(lineElement.e12).toBe(6);
    expect(lineElement.s).toBe(0);

    lineElement.e01 = 6;
    lineElement.e02 = 5;
    lineElement.e03 = 4;
    lineElement.e0123 = 10;

    lineElement.e23 = 3;
    lineElement.e31 = 2;
    lineElement.e12 = 1;
    lineElement.s = -10;

    expect(lineElement).toEqualElement([6, 5, 4, 10, 3, 2, 1, -10]);
  });

  it('Performs core element operations: Lengths', () => {
    const farLine = Line(10, 10, 10, 5, 5, 5);

    // -1 (||ℓ|| = ||lₒ||)
    const metricLength = farLine.length();
    expect(metricLength).toBeCloseTo(8.6602);

    // ||ℓ||∞ == ||l∞||∞
    const infinityLength = farLine.infinityLength();
    expect(infinityLength).toBeCloseTo(17.3205);
  });

  it('Performs core element operations: Normalization', () => {
    const toBeNormalized = Line(1, 2, 3, 3, 2, 1);

    // Satisfy ℓ∙ℓ = -1
    toBeNormalized.normalize();
    {
      expect(toBeNormalized).toApproxEqualElement([
        -0.3054, 0.1527, 0.6108, 0,
        0.8017, 0.5345, 0.2672, 0,
      ], 1e-4);

      const innerProduct = PGA.dot(toBeNormalized, toBeNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Less than one scaling
    const decimalNormalized = Line(0.3, 0.6, 0.9, 0.9, 0.6, 0.3);

    decimalNormalized.normalize();
    {
      expect(decimalNormalized).toApproxEqualElement([
        -0.3054, 0.1527, 0.6108, 0,
        0.8017, 0.5345, 0.2672, 0,
      ], 1e-4);

      const innerProduct = PGA.dot(decimalNormalized, decimalNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Mixed signs
    const mixedNormalized = Line(1, -2, 3, -3, 2, -1);

    mixedNormalized.normalize();
    {
      expect(mixedNormalized).toApproxEqualElement([
        -0.3054, -0.1527, 0.6108, 0,
        -0.8017, 0.5345, -0.2672, 0,
      ], 1e-4);

      const innerProduct = PGA.dot(mixedNormalized, mixedNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Already normalized
    const alreadyNormalized = Line(0, 0, 0, 1, 0, 0);

    alreadyNormalized.normalize();
    {
      expect(alreadyNormalized).toEqualElement([0, 0, 0, 0, 1, 0, 0, 0]);

      const innerProduct = PGA.dot(alreadyNormalized, alreadyNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }
  });

  it('Performs core element operations: Inversion', () => {
    const toBeInverted = Line(1, 2, 3, 3, 2, 1);

    // Satisfy ℓ∙ℓ⁻¹ = 1
    toBeInverted.invert();
    {
      expect(toBeInverted).toApproxEqualElement([
        0.2346, 0.0612, -0.1122, 0,
        -0.2142, -0.1428, -0.0714, 0,
      ], 1e-4);

      const originalLine = Line(1, 2, 3, 3, 2, 1);
      const innerProduct = PGA.dot(originalLine, toBeInverted);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Less than one scaling
    const decimalInverted = Line(0.3, 0.6, 0.9, 0.9, 0.6, 0.3);

    decimalInverted.invert();
    {
      expect(decimalInverted).toApproxEqualElement([
        0.7823, 0.2040, -0.3741, 0,
        -0.7142, -0.4761, -0.2380, 0,
      ], 1e-4);

      const originalLine = Line(0.3, 0.6, 0.9, 0.9, 0.6, 0.3);
      const innerProduct = PGA.dot(originalLine, decimalInverted);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Mixed signs
    const mixedInverted = Line(1, -2, 3, -3, 2, -1);

    mixedInverted.invert();
    {
      expect(mixedInverted).toApproxEqualElement([
        0.2346, -0.0612, -0.1122, 0,
        0.2142, -0.1428, 0.0714, 0,
      ], 1e-4);

      const originalLine = Line(1, -2, 3, -3, 2, -1);
      const innerProduct = PGA.dot(originalLine, mixedInverted);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Inversion flips signs for all grade-2 elements
    const alreadyInverted = Line(0, 0, 0, 1, 0, 0);

    alreadyInverted.invert();
    {
      expect(alreadyInverted).toEqualElement([0, 0, 0, 0, -1, 0, 0, 0]);

      const originalLine = Line(0, 0, 0, 1, 0, 0);
      const innerProduct = PGA.dot(originalLine, alreadyInverted);
      expect(innerProduct).toBeCloseTo(1);
    }
  });
});
