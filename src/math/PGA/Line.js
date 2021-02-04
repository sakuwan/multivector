import PGATypes from './types';
import transform from './impl/helper';

/* === Coordinate indices map ===
 *
 * A more clear way (that is fully optimized away) to deal with the constant
 * <Element>.buffer access throughout the implementation
*/
const L_COORD_IX = 0;
const L_COORD_IY = 1;
const L_COORD_IZ = 2;
const L_COORD_IW = 3;
const L_COORD_OX = 4;
const L_COORD_OY = 5;
const L_COORD_OZ = 6;
const L_COORD_OW = 7;

/* === Line (e01, e02, e03, e0123, e23, e31, e12, s) ===
 *
 * The combination element and representation of general lines is a 6-bivector
 * coordinate multivector, lines are Plücker coordinates that happen to arise
 * naturally in PGA. Both e0123 and s are assumed to be 0 throughout.
 *
 * The LineElement class represents a full line, and its provided methods
 * are unary, and focused on the element itself, rather than the vector space
*/
export class LineElement {
  /* === Element construction ===
   *
   * Set our multivector buffer (Float32Array) and element type (Line)
  */

  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Line;
  }

  /* === Grade antiautomorphisms ===
   * Antiautomorphisms flip the signs of k-vectors depending on their grade
   * Involute  -> Flip the signs of grades 1 and 3
   * Reverse   -> Flip the signs of grades 2 and 3
   * Conjugate -> Flip the signs of grades 1 and 2
   *
   * involute:  [e01, e02, e03, e0123, e23, e31, e12, s]
   *          = [e01, e02, e03, e0123, e23, e31, e12, s]
   * reverse:   [e01, e02, e03, e0123, e23, e31, e12, s]
   *          = [-e01, -e02, -e03, e0123, -e23, -e31, -e12, s]
   * conjugate: [e01, e02, e03, e0123, e23, e31, e12, s]
   *          = [-e01, -e02, -e03, e0123, -e23, -e31, -e12, s]
   * negate:    [e01, e02, e03, e0123, e23, e31, e12, s]
   *          = [-e01, -e02, -e03, -e0123, -e23, -e31, -e12, -s]
  */

  involute() {
    return this;
  }

  reverse() {
    const reverseElement = (x) => -x;
    transform(reverseElement, this.buffer, 0, 3);
    transform(reverseElement, this.buffer, 4, 7);

    return this;
  }

  conjugate() {
    const conjugateElements = (x) => -x;
    transform(conjugateElements, this.buffer, 0, 3);
    transform(conjugateElements, this.buffer, 4, 7);

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
   * get / set e01:   k-vector component access (0 / px)
   * get / set e02:   k-vector component access (1 / py)
   * get / set e03:   k-vector component access (2 / pz)
   * get / set e0123: k-vector component access (3 / I)
   * get / set e23:   k-vector component access (4 / dx)
   * get / set e31:   k-vector component access (5 / dy)
   * get / set e12:   k-vector component access (6 / dz)
   * get / set s:     k-vector component access (7 / s)
  */

  mv() {
    return this.buffer;
  }

  /* eslint-disable lines-between-class-members */
  get e01() { return this.buffer[L_COORD_IX]; }
  get e02() { return this.buffer[L_COORD_IY]; }
  get e03() { return this.buffer[L_COORD_IZ]; }
  get e0123() { return this.buffer[L_COORD_IW]; }

  get e23() { return this.buffer[L_COORD_OX]; }
  get e31() { return this.buffer[L_COORD_OY]; }
  get e12() { return this.buffer[L_COORD_OZ]; }
  get s() { return this.buffer[L_COORD_OW]; }

  set e01(v) { this.buffer[L_COORD_IX] = v; }
  set e02(v) { this.buffer[L_COORD_IY] = v; }
  set e03(v) { this.buffer[L_COORD_IZ] = v; }
  set e0123(v) { this.buffer[L_COORD_IW] = v; }

  set e23(v) { this.buffer[L_COORD_OX] = v; }
  set e31(v) { this.buffer[L_COORD_OY] = v; }
  set e12(v) { this.buffer[L_COORD_OZ] = v; }
  set s(v) { this.buffer[L_COORD_OW] = v; }
  /* eslint-enable lines-between-class-members */

  /* === Element-related Utility ===
   *
   * clone: Create a new element instance initialized with the same multivector
  */

  clone() {
    return new LineElement(new Float32Array(this.buffer));
  }

  /* === General Utility ===
   *
   * type: Return a specific Symbol('Line') instance, used for typechecking
   * toPrimitive: Semi-automatic string coercion for string literals
  */

  type() {
    return this.elementType;
  }

  [Symbol.toPrimitive](type) {
    if (type === 'string') {
      const [a, b, c, i, d, f, g, s] = this.buffer;
      return `Line(${a}e01 + ${b}e02 + ${c}e03 + ${i}e0123 + ${d}e23 + ${f}e31 + ${g}e12 + ${s}s)`;
    }

    return (type === 'number') ? NaN : true;
  }
}

/* === Line factory ===
 *
 * (a, b, c, 0, d, f, g, 0) -> Line(
 *   (a * e01), (b * e02), (c * e03), (0 * e0123)),
 *   (d * e23), (f * e31), (g * e12), (0 * s)),
 * )
*/
export const Line = (a = 0, b = 0, c = 0, d = 0, f = 0, g = 0) => (
  new LineElement(new Float32Array([a, b, c, 0, d, f, g, 0]))
);
