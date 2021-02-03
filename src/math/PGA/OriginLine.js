import PGATypes from './types';
import transform from './impl/helper';

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
   * x / e23: Projective / k-vector component access (0)
   * y / e31: Projective / k-vector component access (1)
   * z / e12: Projective / k-vector component access (2)
   * w / s: Projective / k-vector component access (3)
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

  e23() {
    return this.buffer[0];
  }

  y() {
    return this.buffer[1];
  }

  e31() {
    return this.buffer[1];
  }

  z() {
    return this.buffer[2];
  }

  e12() {
    return this.buffer[2];
  }

  w() {
    return this.buffer[3];
  }

  s() {
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
 * (x, y, z, w) -> OriginLine((x * e23), (y * e31), (z * e12), (w * s))
*/
export const OriginLine = (x = 0, y = 0, z = 0, w = 0) => (
  new OriginElement(new Float32Array([x, y, z, w]))
);
