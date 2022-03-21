/* === Base PGA element creation ===
 *
 * The createPGAElement function constructs a base for the provided element
 * class, extending the provided element with its basis vectors and other
 * general methods
*/

import InvalidError from '../utils/error/InvalidError';

/* === Helper functions & class composition ===
 *
 * createMethodDescriptors: Enumerate all properties of a provided object and
 * create a valid descriptor object for Object.defineProperties, retaining
 * function names
 *
 * applyMethodMixins: Extend the prototype of the provided object with the
 * provided mixins, creating property descriptors using createMethodDescriptors.
 *
 * A compositional approach to prototypal inheritance is preferred here over
 * class inheritance, due to the overhead of super and composition allowing
 * for better selection of what is composed, without influencing other elements
*/
const createMethodDescriptors = (obj) => {
  const defaultConfiguration = {
    enumerable: false,
    writable: false,
    configurable: false,
  };

  const makeDescriptors = (a, c) => ({
    ...a,
    [c]: { ...defaultConfiguration, ...Object.getOwnPropertyDescriptor(obj, c) },
  });

  const propertyKeys = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
  return propertyKeys.reduce(makeDescriptors, {});
};

const applyMethodMixins = (obj, ...mixins) => {
  const objPrototype = obj.prototype ?? Object.getPrototypeOf(obj);
  const applyMixin = (mixin) => (
    Object.defineProperties(objPrototype, createMethodDescriptors(mixin))
  );

  mixins.forEach(applyMixin);
};

/* === Basis component composition ===
 *
 * Create accessors based on the provided basis array, extending the
 * provided object's prototype with the generated accessors, e.g.
 *
 * (Plane, ['e1', 'e2', 'e3', 'e0']) ->
 * Plane.e1 -> get() / set(v) -> this.buffer[0]
 * Plane.e2 -> get() / set(v) -> this.buffer[1]
 * Plane.e3 -> get() / set(v) -> this.buffer[2]
 * Plane.e0 -> get() / set(v) -> this.buffer[3]
*/
const applyBasisMixins = (obj, basis) => {
  const objPrototype = obj.prototype ?? Object.getPrototypeOf(obj);
  const makeAccessorDescriptors = (a, c, i) => ({
    ...a,
    [c]: {
      get: function getBasisVector() {
        return this.buffer[i];
      },
      set: function setBasisVector(v) {
        this.buffer[i] = v;
      },
    },
  });

  Object.defineProperties(objPrototype, basis.reduce(makeAccessorDescriptors, {}));
};

/* === Math operations ===
 *
 * add: Uniform addition with a scalar or an element of the same type
 * sub: Uniform subtraction with a scalar or an element of the same type
 * mul: Uniform scaling with a scalar or an element of the same type
 * div: Uniform inverse scaling with a scalar or an element of the same type
 *
 * eq: Strict equality between elements of the same type
 * approxEq: Approximate equality between elements of the same type
*/
const createMathMixin = () => ({
  add(v) {
    if (typeof v === 'object') {
      if (v.elementType !== this.elementType) throw new InvalidError();

      const { buffer } = this;
      const { buffer: other } = v;
      for (let i = 0; i < buffer.length; i += 1) {
        buffer[i] += other[i];
      }

      return this;
    }

    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] += v;
    }

    return this;
  },

  sub(v) {
    if (typeof v === 'object') {
      if (v.elementType !== this.elementType) throw new InvalidError();

      const { buffer } = this;
      const { buffer: other } = v;
      for (let i = 0; i < buffer.length; i += 1) {
        buffer[i] -= other[i];
      }

      return this;
    }

    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] -= v;
    }

    return this;
  },

  mul(v) {
    if (typeof v === 'object') {
      if (v.elementType !== this.elementType) throw new InvalidError();

      const { buffer } = this;
      const { buffer: other } = v;
      for (let i = 0; i < buffer.length; i += 1) {
        buffer[i] *= other[i];
      }

      return this;
    }

    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] *= v;
    }

    return this;
  },

  div(v) {
    if (typeof v === 'object') {
      if (v.elementType !== this.elementType) throw new InvalidError();

      const { buffer } = this;
      const { buffer: other } = v;
      for (let i = 0; i < buffer.length; i += 1) {
        buffer[i] *= (1.0 / other[i]);
      }

      return this;
    }

    const invRcp = (1.0 / v);

    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] *= invRcp;
    }

    return this;
  },

  eq(v) {
    if (typeof v !== 'object' || v.elementType !== this.elementType) {
      throw new InvalidError('Invalid element: eq expects both elements to be of the same type');
    }

    const { buffer } = this;
    const { buffer: other } = v;
    for (let i = 0; i < buffer.length; i += 1) {
      if (buffer[i] !== other[i]) return false;
    }

    return true;
  },

  approxEq(v, epsilon = 1e-6) {
    if (typeof v !== 'object' || v.elementType !== this.elementType) {
      throw new InvalidError('Invalid element: approxEq expects both elements to be of the same type');
    }

    const { buffer } = this;
    const { buffer: other } = v;
    for (let i = 0; i < buffer.length; i += 1) {
      if (Math.abs(buffer[i] - other[i]) > epsilon) return false;
    }

    return true;
  },
});

/* === Element-related utility ===
 *
 * mv: Alias for accessing buffer property
 * type: Return a specific Symbol instance, used for typechecking
 *
 * set: Set the internal buffer to an array of values
 * clone: Create a new element instance initialized with the same multivector
 *
 * format: Return a formatted string of the element instance
 * toPrimitive: Semi-automatic string coercion for string literals
*/
const createUtilityMixin = (name, basis) => ({
  mv() {
    return this.buffer;
  },

  type() {
    return this.elementType;
  },

  clone() {
    return new this.constructor(new Float32Array(this.buffer));
  },

  set(...values) {
    this.buffer.set(values);
    return this;
  },

  format() {
    const formatElement = (a, c, i) => {
      const vectorValue = `${Math.abs(c)}${basis[i]}`;
      const vectorSign = (i === 0)
        ? `${c < 0 ? '-' : ''}`
        : `${c >= 0 ? ' + ' : ' - '}`;

      return `${a}${vectorSign}${vectorValue}`;
    };

    return `${name}(${this.buffer.reduce(formatElement, '')})`;
  },

  [Symbol.toPrimitive](type) {
    if (type === 'string') return this.format();
    return (type === 'number') ? NaN : true;
  },
});

/* === Grade antiautomorphisms ===
 *
 * Antiautomorphisms flip the signs of k-vectors depending on their grade
 * Involute  -> Flip the signs of grades 1 and 3
 * Reverse   -> Flip the signs of grades 2 and 3
 * Conjugate -> Flip the signs of grades 1 and 2
 * Negate    -> Flip the signs of all grades
 *
 * Example for Plane (e1, e2, e3, e0):
 * involute:  [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
 * reverse:   [e1, e2, e3, e0] = [e1, e2, e3, e0]
 * conjugate: [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
 * negate:    [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
*/
const createGradeMixin = (basis) => {
  const getVectorGrade = (vector) => {
    const vectorGrade = vector.replace(/^\D/, '').length;
    return (vectorGrade > 3) ? 0 : vectorGrade;
  };

  const basisGrades = basis.map(getVectorGrade);

  const involuteMap = [1, -1, 1, -1];
  const reverseMap = [1, 1, -1, -1];
  const conjugateMap = [1, -1, -1, 1];

  return {
    involute() {
      const { buffer } = this;
      for (let i = 0; i < buffer.length; i += 1) {
        buffer[i] *= involuteMap[basisGrades[i]];
      }

      return this;
    },

    involuted() {
      const flipSigns = (x, i) => x * involuteMap[basisGrades[i]];
      return new this.constructor(this.buffer.map(flipSigns));
    },

    reverse() {
      const { buffer } = this;
      for (let i = 0; i < buffer.length; i += 1) {
        buffer[i] *= reverseMap[basisGrades[i]];
      }

      return this;
    },

    reversed() {
      const flipSigns = (x, i) => x * reverseMap[basisGrades[i]];
      return new this.constructor(this.buffer.map(flipSigns));
    },

    conjugate() {
      const { buffer } = this;
      for (let i = 0; i < buffer.length; i += 1) {
        buffer[i] *= conjugateMap[basisGrades[i]];
      }

      return this;
    },

    conjugated() {
      const flipSigns = (x, i) => x * conjugateMap[basisGrades[i]];
      return new this.constructor(this.buffer.map(flipSigns));
    },

    negate() {
      const { buffer } = this;
      for (let i = 0; i < buffer.length; i += 1) {
        buffer[i] = -buffer[i];
      }

      return this;
    },

    negated() {
      const flipSigns = (x) => -x;
      return new this.constructor(this.buffer.map(flipSigns));
    },
  };
};

export default function createPGAElement(element, options) {
  const { name, basis } = options;
  const mergedOptions = {
    math: true,
    grade: true,
    utility: true,
    ...options,
  };

  const mixins = [];
  if (mergedOptions.math) mixins.push(createMathMixin());
  if (mergedOptions.grade) mixins.push(createGradeMixin(basis));
  if (mergedOptions.utility) mixins.push(createUtilityMixin(name, basis));

  applyBasisMixins(element, basis);
  applyMethodMixins(element, ...mixins);
}
