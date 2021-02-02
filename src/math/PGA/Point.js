import PGATypes from './types';
import transform from './impl/helper';

import {
  pointNorm, pointNormSq,
  euclideanNorm, euclideanNormSq,
} from './impl/metric';

/* === Point (e032, e013, e021, e123) ===
 *
 * The trivector element of PGA, points are represented as a result of the
 * intersection of three planes, and has components of grade 3.
 *
 * The PointElement class represents a point, and its provided methods are
 * unary, and focused on the element itself, rather than the vector space
*/
export class PointElement {
  /* === Element construction ===
   *
   * Set our multivector buffer (Float32Array) and element type (Point)
  */

  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Point;
  }

  /* === Metric operations ===
   *
   * euclideanLength: Euclidean/L2 norm
   * euclideanLengthSq: Squared Euclidean length, faster for comparisons
   * length: PGA metric norm
   * lengthSq: Squared PGA metric norm, faster for comparisons
   *
   * normalize: Normalization satisfies P∙P = +-1
   * invert: Inversion satisfies P∙Pinv = P.normalize
  */

  euclideanLength() {
    return euclideanNorm(this.buffer);
  }

  euclideanLengthSq() {
    return euclideanNormSq(this.buffer);
  }

  length() {
    return pointNorm(this.buffer);
  }

  lengthSq() {
    return pointNormSq(this.buffer);
  }

  normalize() {
    const rcp = (1.0 / this.buffer[3]);

    const normalizeElement = (x) => x * rcp;
    transform(normalizeElement, this.buffer);

    return this;
  }

  invert() {
    const rcp = (1.0 / this.buffer[3]) ** 2;

    const invertElement = (x) => x * rcp;
    transform(invertElement, this.buffer);

    return this;
  }

  /* === Grade antiautomorphisms ===
   * Antiautomorphisms flip the signs of k-vectors depending on their grade
   * Involute  -> Flip the signs of grades 1 and 3
   * Reverse   -> Flip the signs of grades 2 and 3
   * Conjugate -> Flip the signs of grades 1 and 2
   *
   * involute:  [e032, e013, e021, e123] = [-e032, -e013, -e021, -e123]
   * reverse:   [e032, e013, e021, e123] = [-e032, -e013, -e021, -e123]
   * conjugate: [e032, e013, e021, e123] = [e032, e013, e021, e123]
   * negate:    [e032, e013, e021, e123] = [-e032, -e013, -e021, -e123]
  */

  involute() {
    const involuteElement = (x) => -x;
    transform(involuteElement, this.buffer);

    return this;
  }

  reverse() {
    const reverseElement = (x) => -x;
    transform(reverseElement, this.buffer);

    return this;
  }

  conjugate() {
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
   * x / e032: Projective / k-vector component access (0)
   * y / e013: Projective / k-vector component access (1)
   * z / e021: Projective / k-vector component access (2)
   * w / e123: Projective / k-vector component access (3)
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

  e032() {
    return this.buffer[0];
  }

  y() {
    return this.buffer[1];
  }

  e013() {
    return this.buffer[1];
  }

  z() {
    return this.buffer[2];
  }

  e021() {
    return this.buffer[2];
  }

  w() {
    return this.buffer[3];
  }

  e123() {
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
    return new PointElement(new Float32Array(this.buffer));
  }

  /* === General Utility ===
   *
   * type: Return a specific Symbol('Point') instance, used for typechecking
   * toPrimitive: Semi-automatic string coercion for string literals
  */

  type() {
    return this.elementType;
  }

  [Symbol.toPrimitive](type) {
    if (type === 'string') {
      const [x, y, z, w] = this.buffer;
      return `Point(${x}e032 + ${y}e013 + ${z}e021 + ${w}e123)`;
    }

    return (type === 'number') ? NaN : true;
  }
}

/* === Point factory ===
 *
 * (x, y, z, w) -> Point((x * e032), (y * e013), (z * e021), (w * e123))
*/
export const Point = (x = 0, y = 0, z = 0, w = 1) => (
  new PointElement(new Float32Array([x, y, z, w]))
);
