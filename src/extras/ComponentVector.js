/*
 * General helper callbacks
*/
const absSum = (a, c) => a + Math.abs(c);
const squaredSum = (a, c) => a + c * c;

/*
 * Mutating map to significantly reduce the amount of repetitive loops
*/
const transform = (fn, arr) => {
  for (let i = 0; i < arr.length; i += 1) {
    arr[i] = fn(arr[i], i); // eslint-disable-line no-param-reassign
  }
};

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
    const diffOf = (x, i) => x - buffer[i];
    return this.buffer.map(diffOf).reduce(squaredSum, 0) ** 0.5;
  }

  /*
   * Normalize to unit length (1), maintaining direction
  */
  normalize() {
    const { buffer } = this;

    const invMag = (1.0 / buffer.reduce(squaredSum, 0) ** 0.5);
    transform((x) => x * invMag, buffer);

    return this;
  }

  /*
   * Compute the dot product with another vector
  */
  dot({ buffer }) {
    const calcDot = (a, c, i) => a + (c * buffer[i]);
    return this.buffer.reduce(calcDot, 0);
  }

  /* === Comparison === */

  /*
   * Compare to another vector with strict equality
  */
  equals({ buffer }) {
    const isEqual = (v, i) => v === buffer[i];
    return this.buffer.every(isEqual);
  }

  /*
   * Compare to another vector with approximate precision
  */
  approxEq({ buffer }, precision = 2) {
    const isApproxEq = (v, i) => Math.abs(buffer[i] - v) < (10 ** -precision) / 2;
    return this.buffer.every(isApproxEq);
  }

  /* === Vector-related Utility === */

  /*
  * Copy the values from another vector
  */
  copy({ buffer }) {
    const copyValue = (_, i) => buffer[i];
    transform(copyValue, this.buffer);

    return this;
  }

  /*
   * Linearly interpolate towards another vector with delta weight
  */
  lerp({ buffer }, delta) {
    const interpolate = (x, i) => x + (buffer[i] - x) * delta;
    transform(interpolate, this.buffer);

    return this;
  }

  /*
   * Set components to the min between itself and another vector
  */
  min({ buffer }) {
    const minOf = (x, i) => Math.min(x, buffer[i]);
    transform(minOf, this.buffer);

    return this;
  }

  /*
   * Set components to the max between itself and another vector
  */
  max({ buffer }) {
    const maxOf = (x, i) => Math.max(x, buffer[i]);
    transform(maxOf, this.buffer);

    return this;
  }

  /*
   * Clamp components to the provided range
  */
  clamp(min, max) {
    const clampBetween = (x) => Math.max(min, Math.min(max, x));
    transform(clampBetween, this.buffer);

    return this;
  }

  /*
   * Round components up to the next integer
  */
  ceil() {
    const ceilValue = (x) => Math.ceil(x);
    transform(ceilValue, this.buffer);

    return this;
  }

  /*
   * Round components down to a less or equal integer
  */
  floor() {
    const floorValue = (x) => Math.floor(x);
    transform(floorValue, this.buffer);

    return this;
  }

  /*
   * Round components depending on the fractional portion of each
  */
  round() {
    const roundValue = (x) => Math.round(x);
    transform(roundValue, this.buffer);

    return this;
  }

  /* === Unary === */

  /*
   * Negation
  */
  negate() {
    const negateValue = (x) => -x;
    transform(negateValue, this.buffer);

    return this;
  }

  /* === Arithmetic === */

  /*
   * Scalar arithmetic operations
  */
  addS(scalar) {
    const addValue = (x) => x + scalar;
    transform(addValue, this.buffer);

    return this;
  }

  subS(scalar) {
    const subValue = (x) => x - scalar;
    transform(subValue, this.buffer);

    return this;
  }

  mulS(scalar) {
    const mulValue = (x) => x * scalar;
    transform(mulValue, this.buffer);

    return this;
  }

  divS(scalar) {
    const divValue = (x) => x * (1.0 / scalar);
    transform(divValue, this.buffer);

    return this;
  }

  /*
   * Vector arithmetic operations
  */
  add({ buffer }) {
    const addVector = (x, i) => x + buffer[i];
    transform(addVector, this.buffer);

    return this;
  }

  sub({ buffer }) {
    const subVector = (x, i) => x - buffer[i];
    transform(subVector, this.buffer);

    return this;
  }

  mul({ buffer }) {
    const mulVector = (x, i) => x * buffer[i];
    transform(mulVector, this.buffer);

    return this;
  }

  div({ buffer }) {
    const divVector = (x, i) => x * (1.0 / buffer[i]);
    transform(divVector, this.buffer);

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
