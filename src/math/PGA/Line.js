import PGATypes from './types';

export class LineElement {
  /* === Element construction ===
   *
   * Set our multivector buffer (Float32Array) and element type (Line)
  */

  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Line;
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
