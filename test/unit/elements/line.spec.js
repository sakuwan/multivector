import {
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
});
