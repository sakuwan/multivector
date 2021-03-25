import {
  PGATypes,

  Translator,
} from '../../../src';

describe('PGA Element - Translator', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof Translator).toBe('function');

    // Default translator, Translator(0, 0, 0, 0)
    const defaultTranslator = Translator();
    expect(defaultTranslator).toEqualElement([0, 0, 0, 0]);

    // Initialize with values, auto-normalization
    const initializedTranslator = Translator(1, 2, 3);
    expect(initializedTranslator).toApproxEqualElement([
      -0.1336, -0.2672, -0.4008, 0,
    ], 1e-4);
  });

  it('Has the proper type identifier', () => {
    // Make sure the instance has the proper type
    const defaultTranslator = Translator();

    const translatorType = defaultTranslator.type();
    expect(translatorType).toBe(PGATypes.Translator);
    expect(translatorType).not.toBe(Symbol('Translator'));
  });

  it('Allows for multivector and component access', () => {
    // (a, b, c, d) -> (1, 2, 3, 1)
    const translatorElement = Translator(1, 2, 3);

    expect(translatorElement).toApproxEqualElement([
      -0.1336, -0.2672, -0.4008, 0,
    ], 1e-4);

    expect(translatorElement.e01).toBeCloseTo(-0.1336);
    expect(translatorElement.e02).toBeCloseTo(-0.2672);
    expect(translatorElement.e03).toBeCloseTo(-0.4008);
    expect(translatorElement.e0123).toBe(0);

    translatorElement.e01 = 4;
    translatorElement.e02 = 3;
    translatorElement.e03 = 2;
    translatorElement.e0123 = 1;

    expect(translatorElement).toEqualElement([4, 3, 2, 1]);
  });

  it('Performs core element operations: Lengths', () => {
    const farTranslator = Translator(10, 10, 10, 5);

    // e0 squares to 0, all components vanish
    const metricLength = farTranslator.length();
    expect(metricLength).toBe(0);

    // ||T∞||∞ = ||R||
    const infinityLength = farTranslator.infinityLength();
    expect(infinityLength).toBeCloseTo(2.5);
  });

  it('Performs core element operations: Normalization', () => {
    const alreadyNormalized = Translator(1, 0, 0);

    // -sqrt(||T₂||) = d/2
    {
      expect(alreadyNormalized).toEqualElement([-0.5, 0, 0, 0]);

      const translatorDistance = -(1 / 2);
      expect(translatorDistance).toBe(alreadyNormalized.e01);
    }

    const toBeNormalized = Translator().set(1, 0, 0, 5);

    // -sqrt(||T₂||) = d/2
    toBeNormalized.normalize();
    {
      expect(toBeNormalized).toApproxEqualElement([-2.5, 0, 0, 0]);

      const translatorDistance = -(5 / 2);
      expect(translatorDistance).toBe(toBeNormalized.e01);
    }
  });

  it('Performs core element operations: Inversion', () => {
    const toBeInverted = Translator().set(1, 0, 0, 5);

    // sqrt(||T₂||) = -d/2
    toBeInverted.invert();
    {
      expect(toBeInverted).toApproxEqualElement([2.5, 0, 0, 0]);

      const translatorDistance = (5 / 2);
      expect(translatorDistance).toBe(toBeInverted.e01);
    }
  });
});
