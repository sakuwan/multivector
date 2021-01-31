import PGATypes from './types';
import transform from './impl/helper';

import {
  pointNorm, pointNormSq,
  euclideanNorm, euclideanNormSq,
} from './impl/metric';

import {
  innerPointPlane,
  innerPointOrigin,
  innerPointLine,
  innerPointPoint,
} from './impl/inner';

import {
  outerPointPlane,
} from './impl/outer';

import {
  dualPoint,
} from './impl/dual';

import {
  regressivePointPlane,
  regressivePointIdeal,
  regressivePointOrigin,
  regressivePointLine,
  regressivePointPoint,
} from './impl/regressive';

export class PointElement {
  /*
   * Set our multivector buffer (Float32Array) and element type (Point)
  */
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Point;
  }

  /* === Unary operations === */

  /*
   * Euclidean length/L2 norm
  */
  euclideanLength() {
    return euclideanNorm(this.buffer);
  }

  /*
   * Squared length, faster for distance comparisons
  */
  euclideanLengthSq() {
    return euclideanNormSq(this.buffer);
  }

  /*
   * PGA metric norm
  */
  length() {
    return pointNorm(this.buffer);
  }

  /*
   * Same as above, no sqrt for faster comparisons
  */
  lengthSq() {
    return pointNormSq(this.buffer);
  }

  /*
   * Point normalization satisfies P^2 = +-1
  */
  normalize() {
    const rcp = (1.0 / this.buffer[3]);

    const normalizeElement = (x) => x * rcp;
    transform(normalizeElement, this.buffer);

    return this;
  }

  /*
   * Inversion satisfies P * Pinv = P.normalize(), or a homogeneous weight of +-1
  */
  invert() {
    const rcp = (1.0 / this.buffer[3]) ** 2;

    const invertElement = (x) => x * rcp;
    transform(invertElement, this.buffer);

    return this;
  }

  /* === Grade antiautomorphisms === */

  /*
   * Involution is a flip of all k-vector components, as they are grade 3
  */
  involute() {
    const involuteElement = (x) => -x;
    transform(involuteElement, this.buffer);

    return this;
  }

  /*
   * Reversion is a flip of all k-vector components, as they are grade 3
  */
  reverse() {
    const reverseElement = (x) => -x;
    transform(reverseElement, this.buffer);

    return this;
  }

  /*
   * Conjugation is a no-op, as grade 3 k-vectors are untouched
  */
  conjugate() {
    return this;
  }

  /*
   * Negate all elements
  */
  negate() {
    const negateElement = (x) => -x;
    transform(negateElement, this.buffer);

    return this;
  }

  /* === Element inner products === */

  /*
   * See impl/inner.js for implementation details
  */

  /*
   * Point ∙ Plane -> Line
  */
  dotPlane({ buffer }) {
    return innerPointPlane(this.buffer, buffer);
  }

  /*
   * Point ∙ Origin -> Plane
  */
  dotOrigin({ buffer }) {
    return innerPointOrigin(this.buffer, buffer);
  }

  /*
   * Point ∙ Line -> Plane
  */
  dotLine({ buffer }) {
    return innerPointLine(this.buffer, buffer);
  }

  /*
   * Point ∙ Point -> Scalar
  */
  dotPoint({ buffer }) {
    return innerPointPoint(this.buffer, buffer);
  }

  /*
   * Inner product typed delegation for ease of use
  */
  dot(other) {
    const type = other.type();

    switch (type) {
      case PGATypes.Plane:
        return innerPointPlane(this.buffer, other.buffer);

      case PGATypes.IdealLine:
        throw new TypeError('Invalid element: Point ∙ Ideal is a null operation');

      case PGATypes.OriginLine:
        return innerPointOrigin(this.buffer, other.buffer);

      case PGATypes.Line:
        return innerPointLine(this.buffer, other.buffer);

      case PGATypes.Point:
        return innerPointPoint(this.buffer, other.buffer);

      default:
        throw new TypeError('Invalid or unsupported element passed to Point::dot');
    }
  }

  /* === Element outer products === */

  /*
   * See impl/outer.js for implementation details
  */

  /*
   * Point ∧ Plane -> Pseudo-scalar
  */
  wedgePlane({ buffer }) {
    return outerPointPlane(this.buffer, buffer);
  }

  /*
   * Outer product typed delegation for ease of use
  */
  wedge(other) {
    const type = other.type();

    switch (type) {
      case PGATypes.Plane:
        return outerPointPlane(this.buffer, other.buffer);

      case PGATypes.IdealLine:
        throw new TypeError('Invalid element: Point ∧ Ideal is a null operation');

      case PGATypes.OriginLine:
        throw new TypeError('Invalid element: Point ∧ Origin is a null operation');

      case PGATypes.Line:
        throw new TypeError('Invalid element: Point ∧ Line is a null operation');

      case PGATypes.Point:
        throw new TypeError('Invalid element: Point ∧ Point is a null operation');

      default:
        throw new TypeError('Invalid or unsupported element passed to Point::wedge');
    }
  }

  /* === Duality === */

  dual() {
    return dualPoint(this.buffer);
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
   * Explicit setters, intuitive as their projective elements
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
export const Point = (x = 0, y = 0, z = 0, w = 1) => (
  new PointElement(new Float32Array([x, y, z, w]))
);
