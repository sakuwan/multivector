import PGATypes from './types';
import transform from './impl/helper';

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
   * px / e01: Projective / k-vector component access (0)
   * py / e02: Projective / k-vector component access (1)
   * pz / e03: Projective / k-vector component access (2)
   * pw / e0123: Projective / k-vector component access (3)
   * dx / e23: Projective / k-vector component access (4)
   * dy / e31: Projective / k-vector component access (5)
   * dz / e12: Projective / k-vector component access (6)
   * dw / s: Projective / k-vector component access (7)
   *
   * setPX: Set the value of the k-vector component at index 0
   * setPY: Set the value of the k-vector component at index 1
   * setPZ: Set the value of the k-vector component at index 2
   * setPW: Set the value of the k-vector component at index 3
   * setDX: Set the value of the k-vector component at index 4
   * setDY: Set the value of the k-vector component at index 5
   * setDZ: Set the value of the k-vector component at index 6
   * setDW: Set the value of the k-vector component at index 7
  */

  mv() {
    return this.buffer;
  }

  px() {
    return this.buffer[0];
  }

  e01() {
    return this.buffer[0];
  }

  py() {
    return this.buffer[1];
  }

  e02() {
    return this.buffer[1];
  }

  pz() {
    return this.buffer[2];
  }

  e03() {
    return this.buffer[2];
  }

  pw() {
    return this.buffer[3];
  }

  e0123() {
    return this.buffer[3];
  }

  dx() {
    return this.buffer[4];
  }

  e23() {
    return this.buffer[4];
  }

  dy() {
    return this.buffer[5];
  }

  e31() {
    return this.buffer[5];
  }

  dz() {
    return this.buffer[6];
  }

  e12() {
    return this.buffer[6];
  }

  dw() {
    return this.buffer[7];
  }

  s() {
    return this.buffer[7];
  }

  setPX(x) {
    this.buffer[0] = x;
    return this;
  }

  setPY(y) {
    this.buffer[1] = y;
    return this;
  }

  setPZ(z) {
    this.buffer[2] = z;
    return this;
  }

  setPW(w) {
    this.buffer[3] = w;
    return this;
  }

  setDX(x) {
    this.buffer[4] = x;
    return this;
  }

  setDY(y) {
    this.buffer[5] = y;
    return this;
  }

  setDZ(z) {
    this.buffer[6] = z;
    return this;
  }

  setDW(w) {
    this.buffer[7] = w;
    return this;
  }

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
      const [x, y, z, w, d, f, g, s] = this.buffer;
      return `Line(${x}e01 + ${y}e02 + ${z}e03 + ${w}e0123 + ${d}e23 + ${f}e31 + ${g}e12 + ${s}s)`;
    }

    return (type === 'number') ? NaN : true;
  }
}

/* === Line factory ===
 *
 * (px, py, pz, 0, dx, dy, dz, 0) -> Line(
 *   (px * e01), (py * e02), (pz * e03), (0 * e0123)),
 *   (dx * e23), (dy * e31), (dz * e12), (0 * s)),
 * )
*/
export const Line = (px = 0, py = 0, pz = 0, dx = 0, dy = 0, dz = 0) => (
  new LineElement(new Float32Array([px, py, pz, 0, dx, dy, dz, 0]))
);
