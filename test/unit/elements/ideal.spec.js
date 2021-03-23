import {
  PGATypes,

  IdealLine,
} from '../../../src';

describe('PGA Element - IdealLine', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof IdealLine).toBe('function');

    // Default ideal line, IdealLine(0, 0, 0, 0)
    const defaultLine = IdealLine();
    expect(defaultLine).toEqualElement([0, 0, 0, 0]);

    // Initialize with values
    const initializedLine = IdealLine(1, 2, 3);
    expect(initializedLine).toEqualElement([1, 2, 3, 0]);
  });

  it('Has the proper type identifier', () => {
    // Make sure the instance has the proper type
    const defaultLine = IdealLine();

    const lineType = defaultLine.type();
    expect(lineType).toBe(PGATypes.IdealLine);
    expect(lineType).not.toBe(Symbol('IdealLine'));
  });

  it('Allows for multivector and component access', () => {
    // (a, b, c, d) -> (1, 2, 3, 4)
    const lineElement = IdealLine(1, 2, 3, 4);

    expect(lineElement).toEqualElement([1, 2, 3, 4]);

    expect(lineElement.e01).toBe(1);
    expect(lineElement.e02).toBe(2);
    expect(lineElement.e03).toBe(3);
    expect(lineElement.e0123).toBe(4);

    lineElement.e01 = 4;
    lineElement.e02 = 3;
    lineElement.e03 = 2;
    lineElement.e0123 = 1;

    expect(lineElement).toEqualElement([4, 3, 2, 1]);
  });

  it('Performs core element operations: Lengths', () => {
    const farLine = IdealLine(10, 10, 10, 5);

    // e0 squares to 0, all components vanish
    const metricLength = farLine.length();
    expect(metricLength).toBe(0);

    // ||l∞||∞ = ||lₒ||
    const infinityLength = farLine.infinityLength();
    expect(infinityLength).toBeCloseTo(18.0277);
  });

  it('Performs core element operations: Normalization', () => {
    const toBeNormalized = IdealLine(1, 2, 3, 0);

    // Assuming l∞ / ||l∞||∞, l∞∙l∞ = -1
    toBeNormalized.normalize();
    {
      expect(toBeNormalized).toApproxEqualElement([
        0.2672, 0.5345, 0.8017, 0,
      ], 1e-4);

      const [e01, e02, e03] = toBeNormalized.mv();

      const innerProduct = -(e01 * e01 + e02 * e02 + e03 * e03);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Less than one scaling
    const decimalNormalized = IdealLine(0.3, 0.6, 0.9, 0);

    decimalNormalized.normalize();
    {
      expect(decimalNormalized).toApproxEqualElement([
        0.2672, 0.5345, 0.8017, 0,
      ], 1e-4);

      const [e01, e02, e03] = decimalNormalized.mv();

      const innerProduct = -(e01 * e01 + e02 * e02 + e03 * e03);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Mixed signs
    const mixedNormalized = IdealLine(1, -2, 3, 0);

    mixedNormalized.normalize();
    {
      expect(mixedNormalized).toApproxEqualElement([
        0.2672, -0.5345, 0.8017, 0,
      ], 1e-4);

      const [e01, e02, e03] = mixedNormalized.mv();

      const innerProduct = -(e01 * e01 + e02 * e02 + e03 * e03);
      expect(innerProduct).toBeCloseTo(-1);
    }

    // Already normalized
    const alreadyNormalized = IdealLine(1, 0, 0, 0);

    alreadyNormalized.normalize();
    {
      expect(alreadyNormalized).toEqualElement([1, 0, 0, 0]);

      const [e01, e02, e03] = alreadyNormalized.mv();

      const innerProduct = -(e01 * e01 + e02 * e02 + e03 * e03);
      expect(innerProduct).toBeCloseTo(-1);
    }
  });

  it('Performs core element operations: Inversion', () => {
    const toBeInverted = IdealLine(1, 2, 3, 0);

    // Assuming l∞ / ||l∞||∞, l∞∙l∞⁻¹ = 1
    toBeInverted.invert();
    {
      expect(toBeInverted).toApproxEqualElement([
        -0.0714, -0.1428, -0.2142, 0,
      ], 1e-4);

      const originalLine = IdealLine(1, 2, 3, 0);

      const [e01, e02, e03] = toBeInverted.mv();
      const [e01o, e02o, e03o] = originalLine.mv();

      const innerProduct = -(e01 * e01o + e02 * e02o + e03 * e03o);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Less than one scaling
    const decimalInverted = IdealLine(0.3, 0.6, 0.9, 0);

    decimalInverted.invert();
    {
      expect(decimalInverted).toApproxEqualElement([
        -0.2380, -0.4761, -0.7142, 0,
      ], 1e-4);

      const originalLine = IdealLine(0.3, 0.6, 0.9, 0);

      const [e01, e02, e03] = decimalInverted.mv();
      const [e01o, e02o, e03o] = originalLine.mv();

      const innerProduct = -(e01 * e01o + e02 * e02o + e03 * e03o);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Mixed signs
    const mixedInverted = IdealLine(1, -2, 3, 0);

    mixedInverted.invert();
    {
      expect(mixedInverted).toApproxEqualElement([
        -0.0714, 0.1428, -0.2142, 0,
      ], 1e-4);

      const originalLine = IdealLine(1, -2, 3, 0);

      const [e01, e02, e03] = mixedInverted.mv();
      const [e01o, e02o, e03o] = originalLine.mv();

      const innerProduct = -(e01 * e01o + e02 * e02o + e03 * e03o);
      expect(innerProduct).toBeCloseTo(1);
    }

    // Inversion flips signs for all grade-2 elements
    const alreadyInverted = IdealLine(1, 0, 0, 0);

    alreadyInverted.invert();
    {
      expect(alreadyInverted).toEqualElement([-1, 0, 0, 0]);

      const originalLine = IdealLine(1, 0, 0, 0);

      const [e01, e02, e03] = alreadyInverted.mv();
      const [e01o, e02o, e03o] = originalLine.mv();

      const innerProduct = -(e01 * e01o + e02 * e02o + e03 * e03o);
      expect(innerProduct).toBeCloseTo(1);
    }
  });
});
