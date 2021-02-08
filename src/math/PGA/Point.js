import PGATypes from './types';
import transform from './impl/helper';

import {
  euclideanNormSq,
  pointNormSq,
  pointInfinityNormSq,
} from './impl/norm';

/* === Coordinate indices map ===
 *
 * A more clear way (that is fully optimized away) to deal with the constant
 * <Element>.buffer access throughout the implementation
*/
const PT_COORD_X = 0;
const PT_COORD_Y = 1;
const PT_COORD_Z = 2;
const PT_COORD_W = 3;

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
   * infinityLength: PGA infinity/ideal norm
   * infinityLengthSq: Squared PGA infinity/ideal norm, faster for comparisons
   *
   * normalize: Normalization satisfies P∙P = +-1
   * invert: Inversion satisfies P∙Pinv = P.normalize
  */

  euclideanLength() {
    return euclideanNormSq(this.buffer) ** 0.5;
  }

  euclideanLengthSq() {
    return euclideanNormSq(this.buffer);
  }

  length() {
    return pointNormSq(this.buffer) ** 0.5;
  }

  lengthSq() {
    return pointNormSq(this.buffer);
  }

  infinityLength() {
    return pointInfinityNormSq(this.buffer) ** 0.5;
  }

  infinityLengthSq() {
    return pointInfinityNormSq(this.buffer);
  }

  normalize() {
    const rcp = (1.0 / this.buffer[PT_COORD_W]);

    const normalizeElement = (x) => x * rcp;
    transform(normalizeElement, this.buffer);

    return this;
  }

  invert() {
    const rcp = (1.0 / this.buffer[PT_COORD_W]) ** 2;

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
   * get / set e032: k-vector component access (0 / x)
   * get / set e013: k-vector component access (1 / y)
   * get / set e021: k-vector component access (2 / z)
   * get / set e123: k-vector component access (3 / w)
  */

  mv() {
    return this.buffer;
  }

  /* eslint-disable lines-between-class-members */
  get e032() { return this.buffer[PT_COORD_X]; }
  get e013() { return this.buffer[PT_COORD_Y]; }
  get e021() { return this.buffer[PT_COORD_Z]; }
  get e123() { return this.buffer[PT_COORD_W]; }

  set e032(v) { this.buffer[PT_COORD_X] = v; }
  set e013(v) { this.buffer[PT_COORD_Y] = v; }
  set e021(v) { this.buffer[PT_COORD_Z] = v; }
  set e123(v) { this.buffer[PT_COORD_W] = v; }
  /* eslint-enable lines-between-class-members */

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
   * print: Return a formatted string of the element instance
   * toPrimitive: Semi-automatic string coercion for string literals
  */

  type() {
    return this.elementType;
  }

  print() {
    const [x, y, z, w] = this.buffer;
    return `Point(${x}e032 + ${y}e013 + ${z}e021 + ${w}e123)`;
  }

  [Symbol.toPrimitive](type) {
    if (type === 'string') return this.print();

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
