import PGATypes from './types';

export class IdealElement {
  /* === Element construction ===
   *
   * Set our multivector buffer (Float32Array) and element type (IdealLine)
  */

  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.IdealLine;
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
