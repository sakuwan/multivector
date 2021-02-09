import PGATypes from './types';
import transform from './impl/helper';

import {
  euclideanNormSq,
  planeNormSq,
  planeInfinityNormSq,
} from './impl/norm';

/* === Coordinate indices map ===
 *
 * A more clear way (that is fully optimized away) to deal with the constant
 * <Element>.buffer access throughout the implementation
*/
const PL_COORD_X = 0;
const PL_COORD_Y = 1;
const PL_COORD_Z = 2;
const PL_COORD_W = 3;

/* === Plane (e1, e2, e3, e0) ===
 *
 * The fundamental element in PGA, all elements are constructed from planes,
 * and the plane itself is a simple k-vector, as its components are grade 1.
 *
 * The PlaneElement class represents a plane, and its provided methods are
 * unary, and focused on the element itself, rather than the vector space
*/
export class PlaneElement {
  /* === Element construction ===
   *
   * Set our multivector buffer (Float32Array) and element type (Plane)
  */

  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Plane;
  }

  /* === Metric operations ===
   *
   * euclideanLength: Euclidean/L2 norm
   * euclideanLengthSq: Squared Euclidean length, faster for comparisons
   * length: PGA metric norm
   * lengthSq: Squared PGA metric norm, faster for comparisons
   * infinityLength: PGA infinity/ideal norm
   * infinityLengthSq: Squared PGA infinity/ideal norm, faster for comparisons
   *
   * normalize: Normalization satisfies p∙p = 1
   * invert: Inversion satisfies p∙pinv = 1
  */

  euclideanLength() {
    return euclideanNormSq(this.buffer) ** 0.5;
  }

  euclideanLengthSq() {
    return euclideanNormSq(this.buffer);
  }

  length() {
    return planeNormSq(this.buffer) ** 0.5;
  }

  lengthSq() {
    return planeNormSq(this.buffer);
  }

  infinityLength() {
    return planeInfinityNormSq(this.buffer) ** 0.5;
  }

  infinityLengthSq() {
    return planeInfinityNormSq(this.buffer);
  }

  normalize() {
    const invSqrt = (1.0 / this.length());

    const normalizeElement = (x) => x * invSqrt;
    transform(normalizeElement, this.buffer, 0, 3);

    return this;
  }

  invert() {
    const invSqrt = (1.0 / this.lengthSq());

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
   * involute:  [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
   * reverse:   [e1, e2, e3, e0] = [e1, e2, e3, e0]
   * conjugate: [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
   * negate:    [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
  */

  involute() {
    const involuteElement = (x) => -x;
    transform(involuteElement, this.buffer);

    return this;
  }

  reverse() {
    return this;
  }

  conjugate() {
    const conjugateElements = (x) => -x;
    transform(conjugateElements, this.buffer);

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
   * get / set e1: k-vector component access (0 / x)
   * get / set e2: k-vector component access (1 / y)
   * get / set e3: k-vector component access (2 / z)
   * get / set e0: k-vector component access (3 / w)
  */

  mv() {
    return this.buffer;
  }

  /* eslint-disable lines-between-class-members */
  get e1() { return this.buffer[PL_COORD_X]; }
  get e2() { return this.buffer[PL_COORD_Y]; }
  get e3() { return this.buffer[PL_COORD_Z]; }
  get e0() { return this.buffer[PL_COORD_W]; }

  set e1(v) { this.buffer[PL_COORD_X] = v; }
  set e2(v) { this.buffer[PL_COORD_Y] = v; }
  set e3(v) { this.buffer[PL_COORD_Z] = v; }
  set e0(v) { this.buffer[PL_COORD_W] = v; }
  /* eslint-enable lines-between-class-members */

  /* === Element-related Utility ===
   *
   * clone: Create a new element instance initialized with the same multivector
  */

  clone() {
    return new PlaneElement(new Float32Array(this.buffer));
  }

  /* === General Utility ===
   *
   * type: Return a specific Symbol('Plane') instance, used for typechecking
   * print: Return a formatted string of the element instance
   * toPrimitive: Semi-automatic string coercion for string literals
  */

  type() {
    return this.elementType;
  }

  print() {
    const [x, y, z, w] = this.buffer;
    return `Plane(${x}e1 + ${y}e2 + ${z}e3 + ${w}e0)`;
  }

  [Symbol.toPrimitive](type) {
    if (type === 'string') this.print();

    return (type === 'number') ? NaN : true;
  }
}

/* === Plane factory ===
 *
 * Represents the usual formula: ax + by + cz + d
 * (a, b, c, d) -> Plane((a * e1), (b * e2), (c * e3), (d * e0))
*/
export const Plane = (a = 0, b = 0, c = 0, d = 0) => (
  new PlaneElement(new Float32Array([a, b, c, d]))
);
