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

/* === Helper functions ===
 *
 * A simple method to reduce the repetitiveness of setting the value property
 * for defineProperties with default configuration options
*/
const createMethodProperty = (fn) => ({ [fn.name]: { value: fn } });

/* === Base element property descriptors ===
 *
 * Methods that are shared between all elements
 *
 * === Metric ===
 *
 * euclideanLength: Euclidean/L2 norm
 * euclideanLengthSq: Squared Euclidean length, faster for comparisons
 *
 * === Utility ===
 *
 * mv: Alias for accessing buffer property
 * type: Return a specific Symbol instance, used for typechecking
 * toPrimitive: Semi-automatic string coercion for string literals
*/
const baseElementDescriptors = {
  ...createMethodProperty(function euclideanLength() {
    return PGAMetric.euclideanNormSq(this.buffer) ** 0.5;
  }),

  ...createMethodProperty(function euclideanLengthSq() {
    return PGAMetric.euclideanNormSq(this.buffer);
  }),

  ...createMethodProperty(function mv() {
    return this.buffer;
  }),

  ...createMethodProperty(function type() {
    return this.elementType;
  }),

  [Symbol.toPrimitive]: {
    value: function toPrimitive(type) {
      if (type === 'string') return this.describe();
      return (type === 'number') ? NaN : true;
    },
  },
};

const createCloneDescriptor = (ElementClass) => ({
  ...createMethodProperty(function clone() {
    return new ElementClass(new Float32Array(this.buffer));
  }),
});

const createDebugDescriptor = (name, basis) => ({
  ...createMethodProperty(function describe() {
    const formatElement = (a, c, i) => {
      const vectorValue = `${Math.abs(c)}${basis[i]}`;
      const vectorSign = (i === 0)
        ? `${c < 0 ? '-' : ''}`
        : `${c > 0 ? ' + ' : ' - '}`;

      return `${a}${vectorSign}${vectorValue}`;
    };

    return `${name}(${this.buffer.reduce(formatElement, '')})`;
  }),
});

const createBasisDescriptors = (basis) => {
  const makeGetSet = (a, c, i) => ({
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

  return basis.reduce(makeGetSet, {});
};

const createAntiautomorphismDescriptors = (basis) => {
  const calcVectorGrade = (vector) => {
    const vectorGrade = vector.replace(/^\D/, '').length;
    return (vectorGrade > 3) ? 0 : vectorGrade;
  };

  const basisGrades = basis.map(calcVectorGrade);

  const involuteMap = [1, -1, 1, -1];
  const reverseMap = [1, 1, -1, -1];
  const conjugateMap = [1, -1, -1, 1];

  return {
    ...createMethodProperty(function involute() {
      const involuteElement = (x, i) => x * involuteMap[basisGrades[i]];
      transform(involuteElement, this.buffer);

      return this;
    }),

    ...createMethodProperty(function reverse() {
      const reverseElement = (x, i) => x * reverseMap[basisGrades[i]];
      transform(reverseElement, this.buffer);

      return this;
    }),

    ...createMethodProperty(function conjugate() {
      const conjugateElement = (x, i) => x * conjugateMap[basisGrades[i]];
      transform(conjugateElement, this.buffer);

      return this;
    }),

    ...createMethodProperty(function negate() {
      const negateElement = (x) => -x;
      transform(negateElement, this.buffer);

      return this;
    }),
  };
};

const createMetricDescriptors = (name) => {

};

export default function createPGAElement(element, name, basis) {
  const cloneDescriptor = createCloneDescriptor(element);
  const debugDescriptor = createDebugDescriptor(name, basis);

  const basisDescriptor = createBasisDescriptors(basis);
  const gradeDescriptor = createAntiautomorphismDescriptors(basis);

  const metricDescriptor = createMetricDescriptors(basis);
}
