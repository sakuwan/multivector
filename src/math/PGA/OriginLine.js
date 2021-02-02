import PGATypes from './types';

export class OriginElement {
  /* === Element construction ===
   *
   * Set our multivector buffer (Float32Array) and element type (OriginLine)
  */

  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.OriginLine;
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
