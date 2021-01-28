import PGATypes from './types';
import transform from './impl/helper';

import {
  planeNorm, planeNormSq,
  euclideanNorm, euclideanNormSq,
} from './impl/metric';

import {
  innerPlanePlane,
  innerPlaneIdeal,
  innerPlaneOrigin,
  innerPlaneLine,
  innerPlanePoint,
} from './impl/inner';

import {
  outerPlanePlane,
  outerPlaneIdeal,
  outerPlaneOrigin,
  outerPlaneLine,
  outerPlanePoint,
} from './impl/outer';

class PlaneElement {
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
    return planeNorm(this.buffer);
  }

  /*
   * Same as above, no sqrt for faster comparisons
  */
  lengthSq() {
    return planeNormSq(this.buffer);
  }

  /*
   * Plane normalization satisfies p∙p = 1, or p^2 = 1
  */
  normalize() {
    const invSqrt = (1.0 / planeNorm(this.buffer));

    const normalizeElement = (x) => x * invSqrt;
    transform(normalizeElement, this.buffer, 0, 3);

    return this;
  }

  /*
   * Plane inversion satisfies p∙pinv = 1
  */
  invert() {
    const invSqrt = (1.0 / planeNorm(this.buffer)) ** 2;

    const normalizeElement = (x) => x * invSqrt;
    transform(normalizeElement, this.buffer);

    return this;
  }

  /* === Element inner products === */

  /*
   * See impl/inner.js for implementation details
  */

  /*
   * Plane ∙ Plane -> Scalar
  */
  dotPlane({ buffer }) {
    return innerPlanePlane(this.buffer, buffer);
  }

  /*
   * Plane ∙ Ideal -> Plane
  */
  dotIdeal({ buffer }) {
    return innerPlaneIdeal(this.buffer, buffer);
  }

  /*
   * Plane ∙ Origin -> Plane
  */
  dotOrigin({ buffer }) {
    return innerPlaneOrigin(this.buffer, buffer);
  }

  /*
   * Plane ∙ Line -> Plane
  */
  dotLine({ buffer }) {
    return innerPlaneLine(this.buffer, buffer);
  }

  /*
   * Plane ∙ Point -> Line
  */
  dotPoint({ buffer }) {
    return innerPlanePoint(this.buffer, buffer);
  }

  /*
   * Inner product typed delegation for ease of use
  */
  dot(other) {
    const type = other.type();

    switch (type) {
      case PGATypes.Plane:
        return innerPlanePlane(this.buffer, other.buffer);

      case PGATypes.IdealLine:
        return innerPlaneIdeal(this.buffer, other.buffer);

      case PGATypes.OriginLine:
        return innerPlaneOrigin(this.buffer, other.buffer);

      case PGATypes.Line:
        return innerPlaneLine(this.buffer, other.buffer);

      case PGATypes.Point:
        return innerPlanePoint(this.buffer, other.buffer);

      default:
        throw new TypeError('Invalid or unsupported element passed to Plane::dot');
    }
  }

  /* === Element outer products === */

  /*
   * See impl/outer.js for implementation details
  */

  /*
   * Plane ∧ Plane -> Line
  */
  wedgePlane({ buffer }) {
    return outerPlanePlane(this.buffer, buffer);
  }

  /*
   * Plane ∧ Ideal -> Point
  */
  wedgeIdeal({ buffer }) {
    return outerPlaneIdeal(this.buffer, buffer);
  }

  /*
   * Plane ∧ Origin -> Point
  */
  wedgeOrigin({ buffer }) {
    return outerPlaneOrigin(this.buffer, buffer);
  }

  /*
   * Plane ∧ Line -> Point
  */
  wedgeLine({ buffer }) {
    return outerPlaneLine(this.buffer, buffer);
  }

  /*
   * Plane ∧ Point -> Pseudo-scalar
  */
  wedgePoint({ buffer }) {
    return outerPlanePoint(this.buffer, buffer);
  }

  /*
   * Outer product typed delegation for ease of use
  */
  wedge(other) {
    const type = other.type();

    switch (type) {
      case PGATypes.Plane:
        return outerPlanePlane(this.buffer, other.buffer);

      case PGATypes.IdealLine:
        return outerPlaneIdeal(this.buffer, other.buffer);

      case PGATypes.OriginLine:
        return outerPlaneOrigin(this.buffer, other.buffer);

      case PGATypes.Line:
        return outerPlaneLine(this.buffer, other.buffer);

      case PGATypes.Point:
        return outerPlanePoint(this.buffer, other.buffer);

      default:
        throw new TypeError('Invalid or unsupported element passed to Plane::wedge');
    }
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
