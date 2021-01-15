/*
 * General helper callbacks
*/
const absSum = (a, c) => a + Math.abs(c);
const squaredSum = (a, c) => a + c * c;

/*
 * Vector wrapper around a %TypedArray% buffer, implements helper Symbols
 * and is the object to be proxied, forwarding %TypedArray% methods to the
 * contained buffer, and should only be instantiated via 'createComponentVector'
*/
class ComponentVector {
  // Wish we had initializer lists!
  constructor(buffer) {
    this.buffer = buffer;
  }

  /* === Core === */

  /*
   * Manhattan (L1) length
  */
  manhattan() {
    return this.buffer.reduce(absSum, 0);
  }

  /*
   * Euclidean (L2) length
  */
  length() {
    return this.buffer.reduce(squaredSum, 0) ** 0.5;
  }

  /*
   * Euclidean (L2) length squared, faster for comparison
  */
  lengthSq() {
    return this.buffer.reduce(squaredSum, 0);
  }

  /*
   * Same as length()
  */
  magnitude() {
    return this.buffer.reduce(squaredSum, 0) ** 0.5;
  }

  /*
   * Same as lengthSq()
  */
  magnitudeSq() {
    return this.buffer.reduce(squaredSum, 0);
  }

  /*
   * Compute the distance between itself and another vector, length(p0 - p1)
  */
  distance({ buffer }) {
    const sub = (x, i) => x - buffer[i];
    return this.buffer.map(sub).reduce(squaredSum, 0) ** 0.5;
  }

  /*
   * Normalize to unit length (1), maintaining direction
  */
  normalize() {
    const { buffer } = this;

    const mag = (1.0 / buffer.reduce(squaredSum, 0) ** 0.5);
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] *= mag;
    }

    return this;
  }

  /*
   * Compute the dot product with another vector
  */
  dot({ buffer }) {
    const dist = (a, c, i) => a + (c * buffer[i]);
    return this.buffer.reduce(dist, 0);
  }

  /* === Comparison === */

  /*
   * Compare to another vector with strict equality
  */
  equals({ buffer }) {
    const equal = (v, i) => v === buffer[i];
    return this.buffer.every(equal);
  }

  /*
   * Compare to another vector with approximate precision
  */
  approxEq({ buffer }, precision = 2) {
    const equal = (v, i) => Math.abs(buffer[i] - v) < (10 ** -precision) / 2;
    return this.buffer.every(equal);
  }

  /* === Vector-related Utility === */

  /*
  * Copy the values from another vector
  */
  copy({ buffer }) {
    const self = this.buffer;
    for (let i = 0; i < self.length; i += 1) {
      self[i] = buffer[i];
    }

    return this;
  }

  /*
   * Linearly interpolate towards another vector with delta weight
  */
  lerp({ buffer }, delta) {
    const self = this.buffer;
    for (let i = 0; i < self.length; i += 1) {
      self[i] += (buffer[i] - self[i]) * delta;
    }

    return this;
  }

  /*
   * Set components to the min between itself and another vector
  */
  min({ buffer }) {
    const self = this.buffer;
    for (let i = 0; i < self.length; i += 1) {
      self[i] = Math.min(self[i], buffer[i]);
    }

    return this;
  }

  /*
   * Set components to the max between itself and another vector
  */
  max({ buffer }) {
    const self = this.buffer;
    for (let i = 0; i < self.length; i += 1) {
      self[i] = Math.max(self[i], buffer[i]);
    }

    return this;
  }

  /*
   * Clamp components to the provided range
  */
  clamp(min, max) {
    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] = Math.max(min, Math.min(max, buffer[i]));
    }

    return this;
  }

  /*
   * Round components up to the next integer
  */
  ceil() {
    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] = Math.ceil(buffer[i]);
    }

    return this;
  }

  /*
   * Round components down to a less or equal integer
  */
  floor() {
    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] = Math.floor(buffer[i]);
    }

    return this;
  }

  /*
   * Round components depending on the fractional portion of each
  */
  round() {
    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] = Math.round(buffer[i]);
    }

    return this;
  }

  /* === Unary === */

  /*
   * Negation
  */
  negate() {
    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] = -buffer[i];
    }

    return this;
  }

  /* === Arithmetic === */

  /*
   * Scalar arithmetic operations
  */
  addS(scalar) {
    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] += scalar; // Addition
    }

    return this;
  }

  subS(scalar) {
    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] -= scalar; // Subtraction
    }

    return this;
  }

  mulS(scalar) {
    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] *= scalar; // Multiplication
    }

    return this;
  }

  divS(scalar) {
    const { buffer } = this;
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] *= (1.0 / scalar); // Inversion tends to be faster for constants
    }

    return this;
  }

  /*
   * Vector arithmetic operations
  */
  add({ buffer }) {
    const self = this.buffer;
    for (let i = 0; i < self.length; i += 1) {
      self[i] += buffer[i]; // Addition
    }

    return this;
  }

  sub({ buffer }) {
    const self = this.buffer;
    for (let i = 0; i < self.length; i += 1) {
      self[i] -= buffer[i]; // Subtraction
    }

    return this;
  }

  mul({ buffer }) {
    const self = this.buffer;
    for (let i = 0; i < self.length; i += 1) {
      self[i] *= buffer[i]; // Multiplication
    }

    return this;
  }

  div({ buffer }) {
    const self = this.buffer;
    for (let i = 0; i < self.length; i += 1) {
      self[i] *= (1.0 / buffer[i]); // Inversion tends to be faster for constants
    }

    return this;
  }

  /* === General Utility === */

  /*
   * toPrimitive, primarily for printing in string coercion
  */
  [Symbol.toPrimitive](type) {
    if (type === 'string') {
      return `(${this.buffer.join(', ')})`; // [1, 2, 3] -> (1, 2, 3)
    }

    const mag = this.magnitude();
    return (type === 'number') ? mag : (mag > 0); // Magnitude for number coercion, default weight
  }
}

export default ComponentVector;
