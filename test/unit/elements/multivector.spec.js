import {
  PGATypes,

  Multivector,
} from '../../../src';

describe('PGA Element - Multivector', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof Multivector).toBe('function');

    // Default multivector, Multivector(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    const defaultMultivector = Multivector();
    expect(defaultMultivector).toEqualElement([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('Has the proper type identifier', () => {
    // Make sure the instance has the proper type
    const defaultMultivector = Multivector();

    const multivectorType = defaultMultivector.type();
    expect(multivectorType).toBe(PGATypes.Multivector);
    expect(multivectorType).not.toBe(Symbol('Multivector'));
  });

  it('Allows for multivector and component access', () => {
    // () -> (new Float32Array(16))
    const multivectorElement = Multivector();

    expect(multivectorElement).toEqualElement([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    multivectorElement.s = 1;
    multivectorElement.e1 = 2;
    multivectorElement.e2 = 3;
    multivectorElement.e3 = 4;
    multivectorElement.e0 = 5;
    multivectorElement.e01 = 6;
    multivectorElement.e02 = 7;
    multivectorElement.e03 = 8;
    multivectorElement.e23 = 9;
    multivectorElement.e31 = 10;
    multivectorElement.e12 = 11;
    multivectorElement.e032 = 12;
    multivectorElement.e013 = 13;
    multivectorElement.e021 = 14;
    multivectorElement.e123 = 15;
    multivectorElement.e0123 = 16;

    expect(multivectorElement.s).toBe(1);
    expect(multivectorElement.e1).toBe(2);
    expect(multivectorElement.e2).toBe(3);
    expect(multivectorElement.e3).toBe(4);
    expect(multivectorElement.e0).toBe(5);
    expect(multivectorElement.e01).toBe(6);
    expect(multivectorElement.e02).toBe(7);
    expect(multivectorElement.e03).toBe(8);
    expect(multivectorElement.e23).toBe(9);
    expect(multivectorElement.e31).toBe(10);
    expect(multivectorElement.e12).toBe(11);
    expect(multivectorElement.e032).toBe(12);
    expect(multivectorElement.e013).toBe(13);
    expect(multivectorElement.e021).toBe(14);
    expect(multivectorElement.e123).toBe(15);
    expect(multivectorElement.e0123).toBe(16);

    expect(multivectorElement).toEqualElement([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]);
  });
});
