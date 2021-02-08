import PGATypes from './types';
import transform from './impl/helper';

import {
  euclideanNormSq,
  idealInfinityNormSq,
} from './impl/norm';

/* === Coordinate indices map ===
 *
 * A more clear way (that is fully optimized away) to deal with the constant
 * <Element>.buffer access throughout the implementation
*/
const IL_COORD_X = 0;
const IL_COORD_Y = 1;
const IL_COORD_Z = 2;
const IL_COORD_W = 3;

/* === Ideal Line (e01, e02, e03, e0123) ===
 *
 * One of the bivector elements of PGA, the ideal line represents the lines
 * at infinity, or the degenerate lines. Throughout this implementation and
 * others, e0123 will be assumed to be 0.
 *
 * The IdealElement class represents an ideal line, and its provided methods
 * are unary, and focused on the element itself, rather than the vector space
*/
export class IdealElement {
  /* === Element construction ===
   *
   * Set our multivector buffer (Float32Array) and element type (IdealLine)
  */

  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.IdealLine;
  }

  /* === Metric operations ===
   *
   * euclideanLength: Euclidean/L2 norm
   * euclideanLengthSq: Squared Euclidean length, faster for comparisons
   * length: Vanishes completely
   * lengthSq: Vanishes completely
   * infinityLength: PGA infinity/ideal norm
   * infinityLengthSq: Squared PGA infinity/ideal norm, faster for comparisons
   *
   * normalize: Normalization satisfies (||l∞||∞)^2 = +-1
   * invert: Inversion satisfies l∞∙l∞inv = l∞.normalize
  */

  euclideanLength() {
    return euclideanNormSq(this.buffer) ** 0.5;
  }

  euclideanLengthSq() {
    return euclideanNormSq(this.buffer);
  }

  length() {
    const fmt = this.print();
    throw new TypeError(`Invalid call: Ideal lines do not have any non-infinite norm ${fmt}`);
  }

  lengthSq() {
    const fmt = this.print();
    throw new TypeError(`Invalid call: Ideal lines do not have any non-infinite norm ${fmt}`);
  }

  infinityLength() {
    return idealInfinityNormSq(this.buffer) ** 0.5;
  }

  infinityLengthSq() {
    return idealInfinityNormSq(this.buffer);
  }

  normalize() {
    const invSqrt = (1.0 / this.infinityLength());

    const normalizeElement = (x) => x * invSqrt;
    transform(normalizeElement, this.buffer);

    return this;
  }

  invert() {
    const invSqrt = (1.0 / this.infinityLengthSq());

    const normalizeElement = (x) => x * invSqrt;
    transform(normalizeElement, this.buffer);

    return this;
  }

  /* === Grade antiautomorphisms ===
   * Antiautomorphisms flip the signs of k-vectors depending on their grade
   * Involute  -> Flip the signs of grades 1 and 3
   * Reverse   -> Flip the signs of grades 2 and 3
   * Conjugate -> Flip the signs of grades 1 and 2
   *
   * involute:  [e01, e02, e03, e0123] = [e01, e02, e03, e0123]
   * reverse:   [e01, e02, e03, e0123] = [-e01, -e02, -e03, e0123]
   * conjugate: [e01, e02, e03, e0123] = [-e01, -e02, -e03, e0123]
   * negate:    [e01, e02, e03, e0123] = [-e01, -e02, -e03, -e0123]
  */

  involute() {
    return this;
  }

  reverse() {
    const reverseElement = (x) => -x;
    transform(reverseElement, this.buffer, 0, 3);

    return this;
  }

  conjugate() {
    const conjugateElements = (x) => -x;
    transform(conjugateElements, this.buffer, 0, 3);

    return this;
  }

  negate() {
    const negateElement = (x) => -x;
    transform(negateElement, this.buffer);

    return this;
  }

  /* === Multivector component access ===
   *
   * mv: Alias for accessing buffer property
   *
   * get / set e01:   k-vector component access (0 / x)
   * get / set e02:   k-vector component access (1 / y)
   * get / set e03:   k-vector component access (2 / z)
   * get / set e0123: k-vector component access (3 / w)
  */

  mv() {
    return this.buffer;
  }

  /* eslint-disable lines-between-class-members */
  get e01() { return this.buffer[IL_COORD_X]; }
  get e02() { return this.buffer[IL_COORD_Y]; }
  get e03() { return this.buffer[IL_COORD_Z]; }
  get e0123() { return this.buffer[IL_COORD_W]; }

  set e01(v) { this.buffer[IL_COORD_X] = v; }
  set e02(v) { this.buffer[IL_COORD_Y] = v; }
  set e03(v) { this.buffer[IL_COORD_Z] = v; }
  set e0123(v) { this.buffer[IL_COORD_W] = v; }
  /* eslint-enable lines-between-class-members */

  /* === Element-related Utility ===
   *
   * clone: Create a new element instance initialized with the same multivector
  */

  clone() {
    return new IdealElement(new Float32Array(this.buffer));
  }

  /* === General Utility ===
   *
   * type: Return a specific Symbol('IdealLine') instance, used for typechecking
   * print: Return a formatted string of the element instance
   * toPrimitive: Semi-automatic string coercion for string literals
  */

  type() {
    return this.elementType;
  }

  print() {
    const [x, y, z, w] = this.buffer;
    return `IdealLine(${x}e01 + ${y}e02 + ${z}e03 + ${w}e0123)`;
  }

  [Symbol.toPrimitive](type) {
    if (type === 'string') return this.print();

    return (type === 'number') ? NaN : true;
  }
}

/* === IdealLine factory ===
 *
 * (a, b, c, d) -> IdealLine((a * e01), (b * e02), (c * e03), (d * e0123))
*/
export const IdealLine = (a = 0, b = 0, c = 0, d = 0) => (
  new IdealElement(new Float32Array([a, b, c, d]))
);
