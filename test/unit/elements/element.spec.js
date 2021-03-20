import createPGAElement from '../../../src/PGA/elements/PGAElement';
import InvalidError from '../../../src/PGA/utils/error/InvalidError';

const TestType = Symbol('TestElement');
class TestElement {
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = TestType;
  }
}

createPGAElement(TestElement, {
  basis: ['s', 'e0', 'e01', 'e012', 'e0123'],
  name: 'TestElement',
});

const Test = (a, b, c, d, e) => (
  new TestElement(new Float32Array([a, b, c, d, e]))
);

describe('PGA Element - Core', () => {
  it('Performs math operations: Addition', () => {
    // add: Uniform addition with a scalar or an element of the same type
    const defaultElement = Test(1, 1, 1, 1, 1);
    const toBeAdded = Test(1, 2, 3, 4, 5);

    defaultElement.add(toBeAdded);
    expect(defaultElement.buffer).toEqual(new Float32Array([2, 3, 4, 5, 6]));

    defaultElement.add(1);
    expect(defaultElement.buffer).toEqual(new Float32Array([3, 4, 5, 6, 7]));

    const invalidElement = {};
    try {
      defaultElement.add(invalidElement);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidError);
    }
  });

  it('Performs math operations: Subtraction', () => {
    // sub: Uniform subtraction with a scalar or an element of the same type
    const defaultElement = Test(1, 1, 1, 1, 1);
    const toBeSubtracted = Test(1, 2, 3, 4, 5);

    defaultElement.sub(toBeSubtracted);
    expect(defaultElement.buffer).toEqual(new Float32Array([0, -1, -2, -3, -4]));

    defaultElement.sub(1);
    expect(defaultElement.buffer).toEqual(new Float32Array([-1, -2, -3, -4, -5]));

    const invalidElement = {};
    try {
      defaultElement.sub(invalidElement);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidError);
    }
  });

  it('Performs math operations: Multiplication', () => {
    // mul: Uniform scaling with a scalar or an element of the same type
    const defaultElement = Test(0, 1, 2, 3, 4);
    const toBeScaled = Test(1, 2, 3, 4, 5);

    defaultElement.mul(toBeScaled);
    expect(defaultElement.buffer).toEqual(new Float32Array([0, 2, 6, 12, 20]));

    defaultElement.mul(2);
    expect(defaultElement.buffer).toEqual(new Float32Array([0, 4, 12, 24, 40]));

    const invalidElement = {};
    try {
      defaultElement.mul(invalidElement);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidError);
    }
  });

  it('Performs math operations: Division', () => {
    // div: Uniform inverse scaling with a scalar or an element of the same type
    const defaultElement = Test(2, 4, 6, 8, 10);
    const toBeDivided = Test(1, 2, 3, 4, 5);

    defaultElement.div(toBeDivided);
    expect(defaultElement.buffer).toEqual(new Float32Array([2, 2, 2, 2, 2]));

    defaultElement.div(2);
    expect(defaultElement.buffer).toEqual(new Float32Array([1, 1, 1, 1, 1]));

    const invalidElement = {};
    try {
      defaultElement.div(invalidElement);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidError);
    }
  });

  it('Performs math operations: Equality', () => {
    // eq: Strict equality between elements of the same type
    const defaultElement = Test(1, 1, 1, 1, 1);
    const equalElement = Test(1, 1, 1, 1, 1);

    const isEqual = defaultElement.eq(equalElement);
    expect(isEqual).toBe(true);

    const notEqualElement = Test(1, 1, 1, 1, 2);
    const isNotEqual = defaultElement.eq(notEqualElement);
    expect(isNotEqual).toBe(false);

    const invalidElement = {};
    try {
      defaultElement.eq(invalidElement);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidError);
    }
  });

  it('Performs math operations: Approximate Equality', () => {
    // approxEq: Approximate equality between elements of the same type
    const defaultElement = Test(1, 1, 1, 1, 1);
    const equalElement = Test(0.9999999, 1.0000001, 1, 1, 1);

    // Acceptable error of 1e6
    const isEqual = defaultElement.approxEq(equalElement);
    expect(isEqual).toBe(true);

    const notEqualElement = Test(0.999999, 1.000001, 1, 1, 1);
    const isNotEqual = defaultElement.approxEq(notEqualElement);
    expect(isNotEqual).toBe(false);

    const invalidElement = {};
    try {
      defaultElement.approxEq(invalidElement);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidError);
    }
  });

  it('Performs grade operations: Involution', () => {
    // Involute -> Flip the signs of grades 1 and 3
    const toBeInvoluted = Test(1, 1, 1, 1, 1);

    toBeInvoluted.involute();
    expect(toBeInvoluted.buffer).toEqual(new Float32Array([1, -1, 1, -1, 1]));

    const originalTest = toBeInvoluted.involuted();
    expect(originalTest.buffer).toEqual(new Float32Array([1, 1, 1, 1, 1]));
  });

  it('Performs grade operations: Reversion', () => {
    // Reverse -> Flip the signs of grades 2 and 3
    const toBeReversed = Test(1, 1, 1, 1, 1);

    toBeReversed.reverse();
    expect(toBeReversed.buffer).toEqual(new Float32Array([1, 1, -1, -1, 1]));

    const originalTest = toBeReversed.reversed();
    expect(originalTest.buffer).toEqual(new Float32Array([1, 1, 1, 1, 1]));
  });

  it('Performs grade operations: Conjugation', () => {
    // Conjugate -> Flip the signs of grades 1 and 2
    const toBeConjugated = Test(1, 1, 1, 1, 1);

    toBeConjugated.conjugate();
    expect(toBeConjugated.buffer).toEqual(new Float32Array([1, -1, -1, 1, 1]));

    const originalTest = toBeConjugated.conjugated();
    expect(originalTest.buffer).toEqual(new Float32Array([1, 1, 1, 1, 1]));
  });

  it('Performs grade operations: Negation', () => {
    // Negate -> Flip the signs of all grades
    const toBeNegated = Test(1, 1, 1, 1, 1);

    toBeNegated.negate();
    expect(toBeNegated.buffer).toEqual(new Float32Array([-1, -1, -1, -1, -1]));

    const originalTest = toBeNegated.negated();
    expect(originalTest.buffer).toEqual(new Float32Array([1, 1, 1, 1, 1]));
  });
});
