import PGATypes from './types';

class PlaneElement {
  /*
   * Set our multivector buffer (Float32Array of length 4) and element type (Plane)
  */
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Plane;
  }

  /* === Core === */

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
  e1() {
    return this.buffer[0];
  }

  e2() {
    return this.buffer[1];
  }

  e3() {
    return this.buffer[2];
  }

  e0() {
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
    return new PlaneElement(new Float32Array(this.buffer));
  }

  /* === General Utility === */

  /*
   * Return a specific Symbol('Plane') instance, used for internal typechecking
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
      return `Plane(${x}e1 + ${y}e2 + ${z}e3 + ${w}e0)`;
    }

    return (type === 'number') ? NaN : true;
  }
}

/*
 * ((x * e1), (y * e2), (z * e3), (w * e0))
*/
export default function makePlane(x = 0, y = 0, z = 0, w = 0) {
  return new PlaneElement(new Float32Array([x, y, z, w]));
}
