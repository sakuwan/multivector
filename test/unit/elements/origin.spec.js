import {
  PGA,
  PGATypes,

  OriginLine,
} from '../../../src';

describe('PGA Element - OriginLine', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof OriginLine).toBe('function');

    // Default origin line, OriginLine(0, 0, 0, 0)
    const defaultLine = OriginLine();
    expect(defaultLine).toEqualElement([0, 0, 0, 0]);

    // Initialize with values
    const initializedLine = OriginLine(1, 2, 3);
    expect(initializedLine).toEqualElement([1, 2, 3, 0]);
  });

  it('Has the proper type identifier', () => {
    // Make sure the instance has the proper type
    const defaultLine = OriginLine();

    const lineType = defaultLine.type();
    expect(lineType).toBe(PGATypes.OriginLine);
    expect(lineType).not.toBe(Symbol('OriginLine'));
  });

  it('Allows for multivector and component access', () => {
    // (a, b, c, d) -> (1, 2, 3, 4)
    const lineElement = OriginLine(1, 2, 3, 4);

    expect(lineElement).toEqualElement([1, 2, 3, 4]);

    expect(lineElement.e23).toBe(1);
    expect(lineElement.e31).toBe(2);
    expect(lineElement.e12).toBe(3);
    expect(lineElement.s).toBe(4);

    lineElement.e23 = 4;
    lineElement.e31 = 3;
    lineElement.e12 = 2;
    lineElement.s = 1;

    expect(lineElement).toEqualElement([4, 3, 2, 1]);
  });

  it('Performs core element operations: Lengths', () => {
    const farLine = OriginLine(10, 10, 10, 5);

    // No components vanish
    const metricLength = farLine.length();
    expect(metricLength).toBeCloseTo(18.0277);

    // ||lₒ||∞ = ||l∞|| (All components vanish)
    const infinityLength = farLine.infinityLength();
    expect(infinityLength).toBe(0);
  });

  it('Performs core element operations: Normalization', () => {
    const toBeNormalized = OriginLine(1, 2, 3, 0);

    // Satisfy lₒ∙lₒ = -1
    toBeNormalized.normalize();
    {
      expect(toBeNormalized).toApproxEqualElement([
        0.2672, 0.5345, 0.8017, 0,
      ], 1e-4);

      const innerProduct = PGA.dot(toBeNormalized, toBeNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Less than one scaling
    const decimalNormalized = OriginLine(0.3, 0.6, 0.9, 0);

    decimalNormalized.normalize();
    {
      expect(decimalNormalized).toApproxEqualElement([
        0.2672, 0.5345, 0.8017, 0,
      ], 1e-4);

      const innerProduct = PGA.dot(decimalNormalized, decimalNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Mixed signs
    const mixedNormalized = OriginLine(1, -2, 3, 0);

    mixedNormalized.normalize();
    {
      expect(mixedNormalized).toApproxEqualElement([
        0.2672, -0.5345, 0.8017, 0,
      ], 1e-4);

      const innerProduct = PGA.dot(mixedNormalized, mixedNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Already normalized
    const alreadyNormalized = OriginLine(1, 0, 0, 0);

    alreadyNormalized.normalize();
    {
      expect(alreadyNormalized).toEqualElement([1, 0, 0, 0]);

      const innerProduct = PGA.dot(alreadyNormalized, alreadyNormalized);
      expect(innerProduct).toBeCloseTo(-1);
    }
  });

  it('Performs core element operations: Inversion', () => {
    const toBeInverted = OriginLine(1, 2, 3, 0);

    // Satisfy lₒ∙lₒ⁻¹ = 1
    toBeInverted.invert();
    {
      expect(toBeInverted).toApproxEqualElement([
        -0.0714, -0.1428, -0.2142, 0,
      ], 1e-4);

      const originalLine = OriginLine(1, 2, 3, 0);
      const innerProduct = PGA.dot(originalLine, toBeInverted);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Less than one scaling
    const decimalInverted = OriginLine(0.3, 0.6, 0.9, 0);

    decimalInverted.invert();
    {
      expect(decimalInverted).toApproxEqualElement([
        -0.2380, -0.4761, -0.7142, 0,
      ], 1e-4);

      const originalLine = OriginLine(0.3, 0.6, 0.9, 0);
      const innerProduct = PGA.dot(originalLine, decimalInverted);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Mixed signs
    const mixedInverted = OriginLine(1, -2, 3, 0);

    mixedInverted.invert();
    {
      expect(mixedInverted).toApproxEqualElement([
        -0.0714, 0.1428, -0.2142, 0,
      ], 1e-4);

      const originalLine = OriginLine(1, -2, 3, 0);
      const innerProduct = PGA.dot(originalLine, mixedInverted);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Inversion flips signs for all grade-2 elements
    const alreadyInverted = OriginLine(1, 0, 0, 0);

    alreadyInverted.invert();
    {
      expect(alreadyInverted).toEqualElement([-1, 0, 0, 0]);

      const originalLine = OriginLine(1, 0, 0, 0);
      const innerProduct = PGA.dot(originalLine, alreadyInverted);
      expect(innerProduct).toBeCloseTo(1);
    }
  });
});
