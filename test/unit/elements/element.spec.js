import createPGAElement from '../../../src/PGA/elements/PGAElement';

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
  it('Performs core element operations: Involution', () => {
    // Involute -> Flip the signs of grades 1 and 3
    const toBeInvoluted = Test(1, 1, 1, 1, 1);

    toBeInvoluted.involute();
    expect(toBeInvoluted.buffer).toEqual(new Float32Array([1, -1, 1, -1, 1]));
  });

  it('Performs core element operations: Reversion', () => {
    // Reverse -> Flip the signs of grades 2 and 3
    const toBeReversed = Test(1, 1, 1, 1, 1);

    toBeReversed.reverse();
    expect(toBeReversed.buffer).toEqual(new Float32Array([1, 1, -1, -1, 1]));
  });

  it('Performs core element operations: Conjugation', () => {
    // Conjugate -> Flip the signs of grades 1 and 2
    const toBeConjugated = Test(1, 1, 1, 1, 1);

    toBeConjugated.conjugate();
    expect(toBeConjugated.buffer).toEqual(new Float32Array([1, -1, -1, 1, 1]));
  });

  it('Performs core element operations: Negation', () => {
    // Negate -> Flip the signs of all grades
    const toBeNegated = Test(1, 1, 1, 1, 1);

    toBeNegated.negate();
    expect(toBeNegated.buffer).toEqual(new Float32Array([-1, -1, -1, -1, -1]));
  });
});
