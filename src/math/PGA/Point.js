import PGATypes from './types';

class PointElement {
  /*
   * Set our multivector buffer (Float32Array of length 4) and element type (Point)
  */
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Point;
  }

  /* === Core === */

  /*
  * Familiar Euclidean length function, same as R^3
  */
  length() {
    let result = 0;
    for (let i = 0; i < 4; i += 1) {
      result += this.buffer[i] ** 2;
    }

    return result ** 0.5;
  }

  /*
  * e032, e013, e021, e123 has a metric of 0, 0, 0, -1, so discard all but e123
  * As the result will be sqrt(|w^2|), discard the negation
  */
  metricLength() {
    return ((this.buffer[3] ** 2) ** 0.5);
  }

  /*
   * Point normalization satisfies X^2 = +-1
  */
  normalize() {
    const e123 = this.buffer[3]; // w or e123
    const rcp = (1.0 / e123) * (2 - (1.0 / e123) * e123);

    for (let i = 0; i < 4; i += 1) {
      this.buffer[i] *= rcp;
    }

    return this;
  }

  /*
   * Inversion satisfies X * Xinv = X.normalize(), or a homogeneous weight of +-1
  */
  invert() {
    const e123 = this.buffer[3]; // w or e123
    const rcp = ((1.0 / e123) * (2 - (1.0 / e123) * e123)) ** 2;

    for (let i = 0; i < 4; i += 1) {
      this.buffer[i] *= rcp;
    }

    return this;
  }

  /*
   * Reversion is a flip of all k-vector components, as they are grade 3
  */
  reverse() {
    for (let i = 0; i < 4; i += 1) {
      this.buffer[i] = -this.buffer[i];
    }

    return this;
  }

  /*
   * Conjugation is a no-op, as grade 3 k-vectors are untouched
  */
  conjugate() {
    return this;
  }

  /* === Multivector component access === */

  /*
   * Alias to access buffer property
  */
  mv() {
    return this.buffer;
  }

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

  /*
   * Explicit setters, simpler as their projective elements
  */
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

  /* === Element-related Utility === */

  /*
   * Create a new PointElement instance initialized with the same multivector
  */
  clone() {
    return new PointElement(new Float32Array(this.buffer));
  }

  /* === General Utility === */

  /*
   * Return a specific Symbol('Point') instance, used for internal typechecking
  */
  type() {
    return this.elementType;
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
