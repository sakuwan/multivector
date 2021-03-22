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
    expect(defaultElement).toEqualElement([2, 3, 4, 5, 6]);

    defaultElement.add(1);
    expect(defaultElement).toEqualElement([3, 4, 5, 6, 7]);

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
    expect(defaultElement).toEqualElement([0, -1, -2, -3, -4]);

    defaultElement.sub(1);
    expect(defaultElement).toEqualElement([-1, -2, -3, -4, -5]);

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
    expect(defaultElement).toEqualElement([0, 2, 6, 12, 20]);

    defaultElement.mul(2);
    expect(defaultElement).toEqualElement([0, 4, 12, 24, 40]);

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
    expect(defaultElement).toEqualElement([2, 2, 2, 2, 2]);

    defaultElement.div(2);
    expect(defaultElement).toEqualElement([1, 1, 1, 1, 1]);

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
    expect(toBeInvoluted).toEqualElement([1, -1, 1, -1, 1]);

    const originalTest = toBeInvoluted.involuted();
    expect(originalTest).toEqualElement([1, 1, 1, 1, 1]);
  });

  it('Performs grade operations: Reversion', () => {
    // Reverse -> Flip the signs of grades 2 and 3
    const toBeReversed = Test(1, 1, 1, 1, 1);

    toBeReversed.reverse();
    expect(toBeReversed).toEqualElement([1, 1, -1, -1, 1]);

    const originalTest = toBeReversed.reversed();
    expect(originalTest).toEqualElement([1, 1, 1, 1, 1]);
  });

  it('Performs grade operations: Conjugation', () => {
    // Conjugate -> Flip the signs of grades 1 and 2
    const toBeConjugated = Test(1, 1, 1, 1, 1);

    toBeConjugated.conjugate();
    expect(toBeConjugated).toEqualElement([1, -1, -1, 1, 1]);

    const originalTest = toBeConjugated.conjugated();
    expect(originalTest).toEqualElement([1, 1, 1, 1, 1]);
  });

  it('Performs grade operations: Negation', () => {
    // Negate -> Flip the signs of all grades
    const toBeNegated = Test(1, 1, 1, 1, 1);

    toBeNegated.negate();
    expect(toBeNegated).toEqualElement([-1, -1, -1, -1, -1]);

    const originalTest = toBeNegated.negated();
    expect(originalTest).toEqualElement([1, 1, 1, 1, 1]);
  });

  it('Performs utility operations: Accessors', () => {
    // mv: Alias for accessing buffer property
    const defaultElement = Test(1, 1, 1, 1, 1);

    const mv = defaultElement.mv();
    expect(mv).toBe(defaultElement.buffer);

    // type: Return a specific Symbol instance, used for typechecking
    const type = defaultElement.type();
    expect(type).toBe(TestType);
  });

  it('Performs utility operations: Clone', () => {
    // clone: Create a new element instance initialized with the same multivector
    const defaultElement = Test(1, 1, 1, 1, 1);

    const clonedElement = defaultElement.clone();
    expect(clonedElement).toEqualElement([1, 1, 1, 1, 1]);
    expect(clonedElement.buffer).not.toBe(defaultElement.buffer);

    clonedElement.buffer[0] = 10;
    expect(defaultElement.buffer[0]).toBe(1);
  });

  it('Performs utility operations: Set', () => {
    // set: Set the internal buffer to an array of values
    const defaultElement = Test(1, 1, 1, 1, 1);

    defaultElement.set(1, 2, 3, 4, 5);
    expect(defaultElement).toEqualElement([1, 2, 3, 4, 5]);

    defaultElement.set(3, 2, 1);
    expect(defaultElement).toEqualElement([3, 2, 1, 4, 5]);
  });

  it('Performs utility operations: Format', () => {
    // format: Return a formatted string of the element instance
    const defaultElement = Test(1, 1, 1, 1, 1);

    const positiveFormat = defaultElement.format();
    const positiveString = 'TestElement(1s + 1e0 + 1e01 + 1e012 + 1e0123)';
    expect(positiveFormat).toBe(positiveString);

    defaultElement.set(-1, 1, -1, 1, -1);
    const negativeFormat = defaultElement.format();
    const negativeString = 'TestElement(-1s + 1e0 - 1e01 + 1e012 - 1e0123)';
    expect(negativeFormat).toBe(negativeString);
  });

  it('Performs utility operations: Symbol.toPrimitive', () => {
    // toPrimitive: Semi-automatic string coercion for string literals
    const defaultElement = Test(1, 1, 1, 1, 1);

    const stringCoercion = `${defaultElement}`;
    const positiveString = 'TestElement(1s + 1e0 + 1e01 + 1e012 + 1e0123)';
    expect(stringCoercion).toBe(positiveString);

    const numberCoercion = +defaultElement;
    expect(numberCoercion).toBe(NaN);

    // eslint-disable-next-line prefer-template
    const defaultCoercion = defaultElement + '';
    expect(defaultCoercion).toBe('true');
  });
});
