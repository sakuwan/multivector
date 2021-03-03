import {
  PGA,
  PGATypes,

  Plane,
  Line,
  Point,
  Rotor,
  Translator,
  OriginLine,
  IdealLine,
} from '../../src';

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

    {
      const translatorA = Translator(1, 1, 1, 1);
      for (let i = 0; i < 1000000; i += 1) {
        const pointA = Point(Math.random(), Math.random(), Math.random());
        const pointB = Point(Math.random(), Math.random(), Math.random());

        translatorA.add(PGA.mul(pointA, pointB));
      }

      console.log(translatorA);
    }

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

describe('PGA element - Point', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof Point).toBe('function');

    // Default point, Point(0, 0, 0, 1)
    const defaultPoint = Point();
    expect(defaultPoint.buffer).toEqual(new Float32Array([0, 0, 0, 1]));

    // Initialize with values
    const initializedPoint = Point(1, 2, 3, 4);
    expect(initializedPoint.buffer).toEqual(new Float32Array([1, 2, 3, 4]));

    // Cloning, verify unique instances
    const clonedPoint = defaultPoint.clone();
    expect(clonedPoint.buffer).toEqual(new Float32Array([0, 0, 0, 1]));
    expect(clonedPoint.buffer).not.toBe(defaultPoint.buffer);

    clonedPoint.buffer[0] = 1;
    expect(defaultPoint.buffer[0]).toBe(0);
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

    expect(pointElement.mv()).toEqual(new Float32Array([1, 2, 3, 4]));

    expect(pointElement.e032).toBe(1);
    expect(pointElement.e013).toBe(2);
    expect(pointElement.e021).toBe(3);
    expect(pointElement.e123).toBe(4);

    pointElement.e032 = 4;
    pointElement.e013 = 3;
    pointElement.e021 = 2;
    pointElement.e123 = 1;

    expect(pointElement.mv()).toEqual(new Float32Array([4, 3, 2, 1]));
  });

  it('Performs core element operations: Lengths', () => {
    // Metric will simply be e123
    const farPoint = Point(10, 10, 10, 5);

    const metricLength = farPoint.length();
    expect(metricLength).toBe(5);

    const infinityLength = farPoint.infinityLength();
    expect(infinityLength).toBeCloseTo(17.3205);
  });

  it('Performs core element operations: Normalization', () => {
    // Satisfy P∙P = +-1, the homogeneous coordinate should be of weight 1
    const toBeNormalized = Point(1, 1, 1, 2);

    toBeNormalized.normalize();
    expect(toBeNormalized.buffer).toEqual(new Float32Array([0.5, 0.5, 0.5, 1]));

    // Already normalized
    const alreadyNormalized = Point(1, 1, 1, 1);

    alreadyNormalized.normalize();
    expect(alreadyNormalized.buffer).toEqual(new Float32Array([1, 1, 1, 1]));

    // Scale values upwards instead of down
    const belowOne = Point(1, 1, 1, 0.5);

    belowOne.normalize();
    expect(belowOne.buffer).toEqual(new Float32Array([2, 2, 2, 1]));
  });

  it('Performs core element operations: Inversion', () => {
    // Satisfy P∙P⁻¹ = P∙P = +-1
    const toBeInverted = Point(1, 1, 1, 2);

    toBeInverted.invert();
    expect(toBeInverted.buffer).toEqual(new Float32Array([0.25, 0.25, 0.25, 0.5]));

    // No inverse
    const noInverse = Point(1, 1, 1, 1);

    noInverse.invert();
    expect(noInverse.buffer).toEqual(new Float32Array([1, 1, 1, 1]));

    // Scale values upwards instead of down
    const belowOne = Point(1, 1, 1, 0.5);

    belowOne.invert();
    expect(belowOne.buffer).toEqual(new Float32Array([4, 4, 4, 2]));

    // Ensure negatives are fine
    const negativeInvert = Point(-1, -2, -3, -10);

    negativeInvert.invert();
    expect(negativeInvert.e032).toBeCloseTo(-0.01);
    expect(negativeInvert.e013).toBeCloseTo(-0.02);
    expect(negativeInvert.e021).toBeCloseTo(-0.03);
    expect(negativeInvert.e123).toBeCloseTo(-0.1);
  });

  it('Performs core element operations: Reversion', () => {
    // Reversion of grade 3 k-vectors is simply a sign flip
    const toBeReversed = Point(1, -2, 3, -1);

    toBeReversed.reverse();
    expect(toBeReversed.buffer).toEqual(new Float32Array([-1, 2, -3, 1]));
  });

  it('Performs core element operations: Conjugation', () => {
    // There is no conjugate for this multivector, so expect a no-op
    const noConjugate = Point(1, 2, 3, 4);

    noConjugate.conjugate();
    expect(noConjugate.buffer).toEqual(new Float32Array([1, 2, 3, 4]));
  });
});
