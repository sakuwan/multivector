import PGATypes from './types';
import transform from './impl/helper';

/* === Coordinate indices map ===
 *
 * A more clear way (that is fully optimized away) to deal with the constant
 * <Element>.buffer access throughout the implementation
*/
const OL_COORD_X = 0;
const OL_COORD_Y = 1;
const OL_COORD_Z = 2;
const OL_COORD_W = 3;

/* === Origin Line (e23, e31, e12, s) ===
 *
 * One of the bivector elements of PGA, the origin line represents the lines
 * through the origin, and are non-degenerate. Throughout this implementation
 * and others, s will be assumed to be 0.
 *
 * The OriginElement class represents an origin line, and its provided methods
 * are unary, and focused on the element itself, rather than the vector space
*/
export class OriginElement {
  /* === Element construction ===
   *
   * Set our multivector buffer (Float32Array) and element type (OriginLine)
  */

  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.OriginLine;
  }

  /* === Grade antiautomorphisms ===
   * Antiautomorphisms flip the signs of k-vectors depending on their grade
   * Involute  -> Flip the signs of grades 1 and 3
   * Reverse   -> Flip the signs of grades 2 and 3
   * Conjugate -> Flip the signs of grades 1 and 2
   *
   * involute:  [e23, e31, e12, s] = [e23, e31, e12, s]
   * reverse:   [e23, e31, e12, s] = [-e23, -e31, -e12, s]
   * conjugate: [e23, e31, e12, s] = [-e23, -e31, -e12, s]
   * negate:    [e23, e31, e12, s] = [-e23, -e31, -e12, -s]
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
   * get / set e23: k-vector component access (0 / x)
   * get / set e31: k-vector component access (1 / y)
   * get / set e12: k-vector component access (2 / z)
   * get / set s:   k-vector component access (3 / w)
  */

  mv() {
    return this.buffer;
  }

  /* eslint-disable lines-between-class-members */
  get e23() { return this.buffer[OL_COORD_X]; }
  get e31() { return this.buffer[OL_COORD_Y]; }
  get e12() { return this.buffer[OL_COORD_Z]; }
  get s() { return this.buffer[OL_COORD_W]; }

  set e23(v) { this.buffer[OL_COORD_X] = v; }
  set e31(v) { this.buffer[OL_COORD_Y] = v; }
  set e12(v) { this.buffer[OL_COORD_Z] = v; }
  set s(v) { this.buffer[OL_COORD_W] = v; }
  /* eslint-enable lines-between-class-members */

  /* === Element-related Utility ===
   *
   * clone: Create a new element instance initialized with the same multivector
  */

  clone() {
    return new OriginElement(new Float32Array(this.buffer));
  }

  /* === General Utility ===
   *
   * type: Return a specific Symbol('OriginLine') instance, used for typechecking
   * toPrimitive: Semi-automatic string coercion for string literals
  */

  type() {
    return this.elementType;
  }

  [Symbol.toPrimitive](type) {
    if (type === 'string') {
      const [x, y, z, w] = this.buffer;
      return `OriginLine(${x}e23 + ${y}e31 + ${z}e12 + ${w}s)`;
    }

    return (type === 'number') ? NaN : true;
  }
}

/* === OriginLine factory ===
 *
 * (a, b, c, d) -> OriginLine((a * e23), (b * e31), (c * e12), (d * s))
*/
export const OriginLine = (a = 0, b = 0, c = 0, d = 0) => (
  new OriginElement(new Float32Array([a, b, c, d]))
);
