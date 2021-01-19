import * as PGATypes from './types';

class PointElement {
  // Constructor, set our multivector buffer (Float32Array of length 4)
  constructor(buffer) {
    this.buffer = buffer;
  }

  /* === Core === */

  /*
   * Point normalization satisifes X^2 = +-1
  */
  normalize() {
    const e123 = this.buffer[3];
    const rcp = (1.0 / e123) * (2 - (1.0 / e123) * e123);

    for (let i = 0; i < 4; i += 1) {
      this.buffer[i] *= rcp;
    }

    return this;
  }

  /* === Multivector component access === */

  /*
   * Access components as their projective elements
  */
  x() {
    return this.buffer[0];
  }

  y() {
    return this.buffer[1];
  }

  z() {
    return this.buffer[2];
  }

  w() {
    return this.buffer[3];
  }

  /*
   * Access components as their multivector elements
  */
  e032() {
    return this.buffer[0];
  }

  e013() {
    return this.buffer[1];
  }

  e021() {
    return this.buffer[2];
  }

  e123() {
    return this.buffer[3];
  }

  /* === Element-related Utility === */

  /*
   * Create a new PointElement instance initialized with the same multivector
  */
  clone() {
    return new PointElement(new Float32Array(this.buffer));
  }

  /* === General Utility === */

  /*
   * Return Symbol('Point'), used for internal typechecking
  */
  static type() {
    return PGATypes.Point;
  }

  /*
   * toPrimitive, primarily for printing in string coercion
  */
  [Symbol.toPrimitive](type) {
    if (type === 'string') {
      const [x, y, z, w] = this.buffer;
      return `Point(${x}e032 + ${y}e013 + ${z}e021 + ${w}e123)`;
    }

    return (type === 'number') ? NaN : true;
  }
}

/*
 * ((x * e032), (y * e013), (z * e021), (w * e123))
*/
export default function makePoint(x = 0, y = 0, z = 0, w = 1) {
  return new PointElement(new Float32Array([x, y, z, w]));
}
