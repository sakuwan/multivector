import PGATypes from './types';
import transform from './impl/helper';

import {
  planeNorm, planeNormSq,
  euclideanNorm, euclideanNormSq,
} from './impl/metric';

/* === Plane (e1, e2, e3, e0)
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
   *
   * normalize: Normalization satisfies p∙p = 1
   * invert: Inversion satisfies p∙pinv = 1
  */

  euclideanLength() {
    return euclideanNorm(this.buffer);
  }

  euclideanLengthSq() {
    return euclideanNormSq(this.buffer);
  }

  length() {
    return planeNorm(this.buffer);
  }

  lengthSq() {
    return planeNormSq(this.buffer);
  }

  normalize() {
    const invSqrt = (1.0 / planeNorm(this.buffer));

    const normalizeElement = (x) => x * invSqrt;
    transform(normalizeElement, this.buffer, 0, 3);

    return this;
  }

  invert() {
    const invSqrt = (1.0 / planeNorm(this.buffer)) ** 2;

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
   * x / e1: Projective / k-vector component access (0)
   * y / e2: Projective / k-vector component access (1)
   * z / e3: Projective / k-vector component access (2)
   * w / e0: Projective / k-vector component access (3)
   *
   * setX: Set the value of the k-vector component at index 0
   * setY: Set the value of the k-vector component at index 1
   * setZ: Set the value of the k-vector component at index 2
   * setW: Set the value of the k-vector component at index 3
  */

  mv() {
    return this.buffer;
  }

  x() {
    return this.buffer[0];
  }

  e1() {
    return this.buffer[0];
  }

  y() {
    return this.buffer[1];
  }

  e2() {
    return this.buffer[1];
  }

  z() {
    return this.buffer[2];
  }

  e3() {
    return this.buffer[2];
  }

  w() {
    return this.buffer[3];
  }

  e0() {
    return this.buffer[3];
  }

  setX(x) {
    this.buffer[0] = x;
    return this;
  }

  setY(y) {
    this.buffer[1] = y;
    return this;
  }

  setZ(z) {
    this.buffer[2] = z;
    return this;
  }

  setW(w) {
    this.buffer[3] = w;
    return this;
  }

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
   * toPrimitive: Semi-automatic string coercion for string literals
  */

  type() {
    return this.elementType;
  }

  [Symbol.toPrimitive](type) {
    if (type === 'string') {
      const [x, y, z, w] = this.buffer;
      return `Plane(${x}e1 + ${y}e2 + ${z}e3 + ${w}e0)`;
    }

    return (type === 'number') ? NaN : true;
  }
}

/* === Plane factory
 *
 * (x, y, z, w) -> Plane((x * e1), (y * e2), (z * e3), (w * e0))
*/
export const Plane = (x = 0, y = 0, z = 0, w = 0) => (
  new PlaneElement(new Float32Array([x, y, z, w]))
);
