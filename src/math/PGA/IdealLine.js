import PGATypes from './types';
import transform from './impl/helper';

export class IdealElement {
  /* === Element construction ===
   *
   * Set our multivector buffer (Float32Array) and element type (IdealLine)
  */

  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.IdealLine;
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
   * x / e01: Projective / k-vector component access (0)
   * y / e02: Projective / k-vector component access (1)
   * z / e03: Projective / k-vector component access (2)
   * w / e0123: Projective / k-vector component access (3)
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

  e01() {
    return this.buffer[0];
  }

  y() {
    return this.buffer[1];
  }

  e02() {
    return this.buffer[1];
  }

  z() {
    return this.buffer[2];
  }

  e03() {
    return this.buffer[2];
  }

  w() {
    return this.buffer[3];
  }

  e0123() {
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
    return new IdealElement(new Float32Array(this.buffer));
  }

  /* === General Utility ===
   *
   * type: Return a specific Symbol('IdealLine') instance, used for typechecking
   * toPrimitive: Semi-automatic string coercion for string literals
  */

  type() {
    return this.elementType;
  }

  [Symbol.toPrimitive](type) {
    if (type === 'string') {
      const [x, y, z, w] = this.buffer;
      return `IdealLine(${x}e01 + ${y}e02 + ${z}e03 + ${w}e0123)`;
    }

    return (type === 'number') ? NaN : true;
  }
}

/* === IdealLine factory ===
 *
 * (x, y, z, w) -> IdealLine((x * e01), (y * e02), (z * e03), (w * e0123))
*/
export const IdealLine = (x = 0, y = 0, z = 0, w = 0) => (
  new IdealElement(new Float32Array([x, y, z, w]))
);
