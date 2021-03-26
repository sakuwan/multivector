import {
  PGA,
  PGATypes,

  Motor,
} from '../../../src';

describe('PGA Element - Motor', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof Motor).toBe('function');

    // Default motor, Motor(0, 0, 0, 0, 0, 0, 0, 0)
    const defaultMotor = Motor();
    expect(defaultMotor).toEqualElement([0, 0, 0, 0, 0, 0, 0, 0]);

    // Initialize with values
    const initializedMotor = Motor(1, 2, 3, 4, 5, 6, 7, 8);
    expect(initializedMotor).toEqualElement([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('Has the proper type identifier', () => {
    // Make sure the instance has the proper type
    const defaultMotor = Motor();

    const motorType = defaultMotor.type();
    expect(motorType).toBe(PGATypes.Motor);
    expect(motorType).not.toBe(Symbol('Motor'));
  });

  it('Allows for multivector and component access', () => {
    // (a, b, c, d, e, f, g, h) -> (1, 1, 1, 0, 1, 1, 1, 0)
    const motorElement = Motor(1, 1, 1, 0, 1, 1, 1, 0);

    expect(motorElement).toEqualElement([1, 1, 1, 0, 1, 1, 1, 0]);

    expect(motorElement.e01).toBe(1);
    expect(motorElement.e02).toBe(1);
    expect(motorElement.e03).toBe(1);
    expect(motorElement.e0123).toBe(0);

    expect(motorElement.e23).toBe(1);
    expect(motorElement.e31).toBe(1);
    expect(motorElement.e12).toBe(1);
    expect(motorElement.s).toBe(0);

    motorElement.e01 = 8;
    motorElement.e02 = 7;
    motorElement.e03 = 6;
    motorElement.e0123 = 5;

    motorElement.e23 = 4;
    motorElement.e31 = 3;
    motorElement.e12 = 2;
    motorElement.s = 1;

    expect(motorElement).toEqualElement([8, 7, 6, 5, 4, 3, 2, 1]);
  });

  it('Performs core element operations: Lengths', () => {
    const farMotor = Motor(10, 10, 10, 5, 1, 2, 3, 1);

    // ||R||
    const metricLength = farMotor.length();
    expect(metricLength).toBeCloseTo(3.8729);

    // ||T||∞ == ||T∞||∞
    const infinityLength = farMotor.infinityLength();
    expect(infinityLength).toBeCloseTo(18.0277);
  });

  it('Performs core element operations: Normalization', () => {
    const toBeNormalized = Motor(1, 0, 0, 1, 1, 0, 0, Math.PI / 2);

    // Satisfy M * ∼M = 1
    toBeNormalized.normalize();
    {
      expect(toBeNormalized).toApproxEqualElement([
        0.6254, 0, 0, 0.3981, 0.5370, 0, 0, 0.8435,
      ], 1e-4);

      const innerProduct = PGA.mul(toBeNormalized, toBeNormalized.reversed());
      expect(innerProduct.s).toBeCloseTo(1, 6);
    }

    // Less than one scaling
    const decimalNormalized = Motor(0.3, 0.6, 0.9, 1, 0.3, 0.6, 0.9, Math.PI);

    decimalNormalized.normalize();
    {
      expect(decimalNormalized).toApproxEqualElement([
        0.1051, 0.2102, 0.3153, 0.1405, 0.08992, 0.1798, 0.2697, 0.9416,
      ], 1e-4);

      const innerProduct = PGA.mul(decimalNormalized, decimalNormalized.reversed());
      expect(innerProduct.s).toBeCloseTo(1, 6);
    }

    // Mixed signs
    const mixedNormalized = Motor(-1, 1, -1, 1, -1, 1, -1, Math.PI / 2);

    mixedNormalized.normalize();
    {
      expect(mixedNormalized).toApproxEqualElement([
        -0.3158, 0.3158, -0.3158, 0.6032, -0.4276, 0.4276, -0.4276, 0.6717,
      ], 1e-4);

      const innerProduct = PGA.mul(mixedNormalized, mixedNormalized.reversed());
      expect(innerProduct.s).toBeCloseTo(1, 6);
    }
  });

  it('Performs core element operations: Inversion', () => {
    const toBeInverted = Motor(1, 0, 0, 1, 1, 0, 0, Math.PI / 2);

    // Satisfy M * M⁻¹ = 1
    toBeInverted.invert();
    {
      expect(toBeInverted).toApproxEqualElement([
        -0.3833, 0, 0, 0.1392, -0.2884, 0, 0, 0.4530,
      ], 1e-4);

      const originalMotor = Motor(1, 0, 0, 1, 1, 0, 0, Math.PI / 2);

      const innerProduct = PGA.mul(originalMotor, toBeInverted);
      expect(innerProduct.s).toBeCloseTo(1, 6);
    }

    // Less than one scaling
    const decimalInverted = Motor(0.3, 0.6, 0.9, 1, 0.3, 0.6, 0.9, Math.PI);

    decimalInverted.invert();
    {
      expect(decimalInverted).toApproxEqualElement([
        -0.0360, -0.0721, -0.1082, -0.0055, -0.0269, -0.0539, -0.0808, 0.2822,
      ], 1e-4);

      const originalMotor = Motor(0.3, 0.6, 0.9, 1, 0.3, 0.6, 0.9, Math.PI);

      const innerProduct = PGA.mul(originalMotor, decimalInverted);
      expect(innerProduct.s).toBeCloseTo(1, 6);
    }

    // Mixed signs
    const mixedInverted = Motor(-1, 1, -1, 1, -1, 1, -1, Math.PI / 2);

    mixedInverted.invert();
    {
      expect(mixedInverted).toApproxEqualElement([
        0.0872, -0.0872, 0.0872, 0.3331, 0.1829, -0.1829, 0.1829, 0.2873,
      ], 1e-4);

      const originalMotor = Motor(-1, 1, -1, 1, -1, 1, -1, Math.PI / 2);

      const innerProduct = PGA.mul(originalMotor, mixedInverted);
      expect(innerProduct.s).toBeCloseTo(1, 6);
    }
  });
});
