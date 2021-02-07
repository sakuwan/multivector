/* === Base PGA element creation ===
 *
 * The createPGAElement function constructs a base for the provided element
 * class, extending the provided element with its basis vectors, metric and
 * other general methods
*/

/* === Utility === */
import transform from './impl/helper';

/* === Metric === */
import * as PGAMetric from './impl/metric';

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
    [c]: Object.assign(Object.getOwnPropertyDescriptor(obj, c), defaultConfiguration),
  });

  const propertyKeys = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
  return propertyKeys.reduce(makeDescriptors, {});
};

const applyMethodMixins = (obj, ...mixins) => {
  const objPrototype = obj.prototype ?? Object.getPrototypeOf(obj);
  const applyMixin = (mixin) => {
    const mixinDescriptor = createMethodDescriptors(mixin);
    Object.defineProperties(objPrototype, mixinDescriptor);
  };

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

/* === Element-related utility ===
 *
 * mv: Alias for accessing buffer property
 * type: Return a specific Symbol instance, used for typechecking
 *
 * clone: Create a new element instance initialized with the same multivector
 *
 * describe: Return a formatted string of the element instance
 * toPrimitive: Semi-automatic string coercion for string literals
*/
const createUtilityMixin = (ElementClass, name, basis) => ({
  mv() {
    return this.buffer;
  },

  type() {
    return this.elementType;
  },

  clone() {
    return new ElementClass(new Float32Array(this.buffer));
  },

  describe() {
    const formatElement = (a, c, i) => {
      const vectorValue = `${Math.abs(c)}${basis[i]}`;
      const vectorSign = (i === 0)
        ? `${c < 0 ? '-' : ''}`
        : `${c > 0 ? ' + ' : ' - '}`;

      return `${a}${vectorSign}${vectorValue}`;
    };

    return `${name}(${this.buffer.reduce(formatElement, '')})`;
  },

  [Symbol.toPrimitive](type) {
    if (type === 'string') return this.describe();
    return (type === 'number') ? NaN : true;
  },
});

/* === Grade antiautomorphisms ===
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
      const involuteElement = (x, i) => x * involuteMap[basisGrades[i]];
      transform(involuteElement, this.buffer);

      return this;
    },

    reverse() {
      const reverseElement = (x, i) => x * reverseMap[basisGrades[i]];
      transform(reverseElement, this.buffer);

      return this;
    },

    conjugate() {
      const conjugateElement = (x, i) => x * conjugateMap[basisGrades[i]];
      transform(conjugateElement, this.buffer);

      return this;
    },

    negate() {
      const negateElement = (x) => -x;
      transform(negateElement, this.buffer);

      return this;
    },
  };
};

/* === Metric operations ===
 *
 * Metric operations are automatically inferred from their implementations in
 * './impl/metric', based on the provided element name and whether or not they
 * are valid operations
 *
 * length: PGA metric norm
 * lengthSq: Squared PGA metric norm, faster for comparisons
 *
 * infinityLength: PGA infinity / ideal norm
 * infinityLengthSq: Squared PGA infinity/ideal norm, faster for comparisons
 *
 * euclideanLength: Euclidean / L2 norm
 * euclideanLengthSq: Squared Euclidean length, faster for comparisons
*/
const createMetricMixin = (name) => {
  const prefix = String(name).toLowerCase();
  const prefixRegex = new RegExp(`^(${prefix})`);

  const isOwnMethod = (x) => prefixRegex.test(x);
  const methodsList = Object.keys(PGAMetric).filter(isOwnMethod);

  const fetchMetricMethods = (a, c) => {
    
  };

  return {
    euclideanLength() {
      return PGAMetric.euclideanNorm(this.buffer);
    },

    euclideanLengthSq() {
      return PGAMetric.euclideanNormSq(this.buffer);
    },
  };
};

export default function createPGAElement(element, name, basis) {
  const grade = createGradeMixin(basis);
  const metric = createMetricMixin(name);
  const utility = createUtilityMixin(element, name, basis);

  applyBasisMixins(element, basis);
  applyMethodMixins(element, grade, metric, utility);
}
