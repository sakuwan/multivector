/* === PGA (3, 0, 1) geometric products ===
 *
*/

import { PGATypes } from './types';

/* === Plane geometric products ===
 *
 * Plane * Plane       -> Motor (e01, e02, e03, 0, e23, e31, e12, s)
 * Plane * Ideal line  -> Multivector (e0, e032, e013, e021, e123)
 * Plane * Origin line -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
 * Plane * Line        -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
 * Plane * Point       -> Motor (e01, e02, e03, e0123, e23, e31, e12, 0)
*/

/*
 * Plane * Plane -> Translator (e01, e02, e03, 0)
 * p * p = p ∙ p + p ∧ p
 * Extract the translator portion of the motor, identical to
 * p ∧ p -> l∞ and simplifies to:
 *
 * (a.e0 * b.e1 - a.e1 * b.e0) -> e01
 * (a.e0 * b.e2 - a.e2 * b.e0) -> e02
 * (a.e0 * b.e3 - a.e3 * b.e0) -> e03
*/
export const geometricPlanePlaneT = (a, b) => {
  const e01 = a[3] * b[0] - a[0] * b[3];
  const e02 = a[3] * b[1] - a[1] * b[3];
  const e03 = a[3] * b[2] - a[2] * b[3];

  return new Float32Array([e01, e02, e03, 0]);
};

/*
 * Plane * Plane -> Rotor (e23, e31, e12, s)
 * p * p = p ∙ p + p ∧ p
 * Extract the rotor portion of the motor, identical to
 * p ∧ p -> p ∙ p + lο and simplifies to:
 *
 * (a.e2 * b.e3 - a.e3 * b.e2) -> e23
 * (a.e3 * b.e1 - a.e1 * b.e3) -> e31
 * (a.e1 * b.e2 - a.e2 * b.e1) -> e12
 * (a.e1 * b.e1) + (a.e2 * b.e2) + (a.e3 * b.e3) -> s
*/
export const geometricPlanePlaneR = (a, b) => {
  const e23 = a[1] * b[2] - a[2] * b[1];
  const e31 = a[2] * b[0] - a[0] * b[2];
  const e12 = a[0] * b[1] - a[1] * b[0];
  const s = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e23, e31, e12, s]);
};

/*
 * Plane * Plane -> Motor (e01, e02, e03, 0, e23, e31, e12, s)
 * p * p = p ∙ p + p ∧ p
 * Produces a motor that, when normalized, moves p₂ -> p₁
 * (a.e0 * b.e1 - a.e1 * b.e0) -> e01
 * (a.e0 * b.e2 - a.e2 * b.e0) -> e02
 * (a.e0 * b.e3 - a.e3 * b.e0) -> e03
 * (a.e2 * b.e3 - a.e3 * b.e2) -> e23
 * (a.e3 * b.e1 - a.e1 * b.e3) -> e31
 * (a.e1 * b.e2 - a.e2 * b.e1) -> e12
 * (a.e1 * b.e1) + (a.e2 * b.e2) + (a.e3 * b.e3) -> s
*/
export const geometricPlanePlane = (a, b) => {
  const e01 = a[3] * b[0] - a[0] * b[3];
  const e02 = a[3] * b[1] - a[1] * b[3];
  const e03 = a[3] * b[2] - a[2] * b[3];

  const e23 = a[1] * b[2] - a[2] * b[1];
  const e31 = a[2] * b[0] - a[0] * b[2];
  const e12 = a[0] * b[1] - a[1] * b[0];
  const s = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e01, e02, e03, 0, e23, e31, e12, s]);
};

/*
 * Plane * Ideal line -> Multivector (e0, e032, e013, e021, e123)
 * p * l∞ = p ∙ l∞ + p ∧ l∞
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricPlaneIdeal = (a, b) => {
  const e0 = -(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);

  const e032 = a[1] * b[2] - a[2] * b[1] + a[0] * b[3];
  const e013 = a[2] * b[0] - a[0] * b[2] + a[1] * b[3];
  const e021 = a[0] * b[1] - a[1] * b[0] + a[2] * b[3];

  return new Float32Array([0, 0, 0, 0, e0, 0, 0, 0, 0, 0, 0, e032, e013, e021, 0, 0]);
};

/*
 * Plane * Origin line -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
 * p * lο = p ∙ lο + p ∧ lο
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricPlaneOrigin = (a, b) => {
  const e1 = a[0] * b[3] + a[2] * b[1] - a[1] * b[2];
  const e2 = a[1] * b[3] + a[0] * b[2] - a[2] * b[0];
  const e3 = a[2] * b[3] + a[1] * b[0] - a[0] * b[1];
  const e0 = a[3] * b[3];

  const e032 = -(a[3] * b[0]);
  const e013 = -(a[3] * b[1]);
  const e021 = -(a[3] * b[2]);
  const e123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([0, e1, e2, e3, e0, 0, 0, 0, 0, 0, 0, e032, e013, e021, e123, 0]);
};

/*
 * Plane * Line -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
 * p * ℓ = p ∙ ℓ + p ∧ ℓ
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricPlaneLine = (a, b) => {
  const e1 = a[0] * b[7] + a[2] * b[5] - a[1] * b[6];
  const e2 = a[1] * b[7] + a[0] * b[6] - a[2] * b[4];
  const e3 = a[2] * b[7] + a[1] * b[4] - a[0] * b[5];
  const e0 = a[3] * b[7] - (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);

  const e032 = a[1] * b[2] - a[2] * b[1] + a[0] * b[3] - a[3] * b[4];
  const e013 = a[2] * b[0] - a[0] * b[2] + a[1] * b[3] - a[3] * b[5];
  const e021 = a[0] * b[1] - a[1] * b[0] + a[2] * b[3] - a[3] * b[6];
  const e123 = a[0] * b[4] + a[1] * b[5] + a[2] * b[6];

  return new Float32Array([0, e1, e2, e3, e0, 0, 0, 0, 0, 0, 0, e032, e013, e021, e123, 0]);
};

/*
 * Plane * Point -> Motor (e01, e02, e03, e0123, e23, e31, e12, 0)
 * p * P = p ∙ P + p ∧ P
 * Identical to the inner and outer products, no cancellations, full product:
 * (a.e3 * b.e013 - a.e2 * b.e021) -> e01
 * (a.e1 * b.e021 - a.e3 * b.e032) -> e02
 * (a.e2 * b.e032 - a.e1 * b.e013) -> e03
 * (a.e1 * b.e032) + (a.e2 * b.e013) + (a.e3 * b.e021) + (a.e0 * b.e123) -> e0123
 * (a.e1 * b.e123) -> e23
 * (a.e2 * b.e123) -> e31
 * (a.e3 * b.e123) -> e12
*/
export const geometricPlanePoint = (a, b) => {
  const e01 = a[2] * b[1] - a[1] * b[2];
  const e02 = a[0] * b[2] - a[2] * b[0];
  const e03 = a[1] * b[0] - a[0] * b[1];
  const e0123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

  const e23 = a[0] * b[3];
  const e31 = a[1] * b[3];
  const e12 = a[2] * b[3];

  return new Float32Array([e01, e02, e03, e0123, e23, e31, e12, 0]);
};

/* === Ideal line geometric products ===
 *
 * Ideal line * Plane       -> Multivector (e0, e032, e013, e021)
 * Ideal line * Ideal line  -> Vanishes completely
 * Ideal line * Origin line -> Ideal line / Translator (e01, e02, e03, e0123)
 * Ideal line * Line        -> Ideal line / Translator (e01, e02, e03, e0123)
 * Ideal line * Point       -> Multivector (e0, e032, e013, e021)
*/

/*
 * Ideal line * Plane -> Multivector (e0, e032, e013, e021)
 * l∞ * p = l∞ ∙ p + l∞ ∧ p
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricIdealPlane = (a, b) => {
  const e0 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  const e032 = a[2] * b[1] - a[1] * b[2] - a[3] * b[0];
  const e013 = a[0] * b[2] - a[2] * b[0] - a[3] * b[1];
  const e021 = a[1] * b[0] - a[0] * b[1] - a[3] * b[2];

  return new Float32Array([0, 0, 0, 0, e0, 0, 0, 0, 0, 0, 0, e032, e013, e021, 0, 0]);
};

/*
 * Ideal line * Origin line -> Ideal line / Translator (e01, e02, e03, e0123)
 * l∞ * lο = l∞ ∙ lο + l∞ ∧ lο
 * Composes the rotation and translation components of an ideal and origin
 * line, with weighting from both the scalar and pseudoscalar components
 * (a.e03 * b.e31 - a.e02 * b.e12) - (a.e0123 * b.e23 + a.e01 * b.s) -> e01
 * (a.e01 * b.e12 - a.e03 * b.e23) - (a.e0123 * b.e31 + a.e02 * b.s) -> e02
 * (a.e02 * b.e23 - a.e01 * b.e31) - (a.e0123 * b.e12 + a.e03 * b.s) -> e03
 * (a.e01 * b.e23) + (a.e02 * b.e31) + (a.e03 * b.e12) + (a.e0123 * b.s) -> e0123
*/
export const geometricIdealOrigin = (a, b) => {
  const e01 = a[2] * b[1] - a[1] * b[2] - a[3] * b[0] + a[0] * b[3];
  const e02 = a[0] * b[2] - a[2] * b[0] - a[3] * b[1] + a[1] * b[3];
  const e03 = a[1] * b[0] - a[0] * b[1] - a[3] * b[2] + a[2] * b[3];
  const e0123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

  return new Float32Array([e01, e02, e03, e0123]);
};

/*
 * Ideal line * Line -> Ideal line / Translator (e01, e02, e03, e0123)
 * l∞ * ℓ = l∞ ∙ ℓ + l∞ ∧ ℓ
 * Composes the rotation and translation components of an ideal and full line,
 * with weighting from both the scalar and pseudoscalar components
 * (a.e03 * b.e31 - a.e02 * b.e12) - (a.e0123 * b.e23 + a.e01 * b.s) -> e01
 * (a.e01 * b.e12 - a.e03 * b.e23) - (a.e0123 * b.e31 + a.e02 * b.s) -> e02
 * (a.e02 * b.e23 - a.e01 * b.e31) - (a.e0123 * b.e12 + a.e03 * b.s) -> e03
 * (a.e01 * b.e23) + (a.e02 * b.e31) + (a.e03 * b.e12) + (a.e0123 * b.s) -> e0123
*/
export const geometricIdealLine = (a, b) => {
  const e01 = a[2] * b[5] - a[1] * b[6] - a[3] * b[4] + a[0] * b[7];
  const e02 = a[0] * b[6] - a[2] * b[4] - a[3] * b[5] + a[1] * b[7];
  const e03 = a[1] * b[4] - a[0] * b[5] - a[3] * b[6] + a[2] * b[7];
  const e0123 = a[0] * b[4] + a[1] * b[5] + a[2] * b[6] + a[3] * b[7];

  return new Float32Array([e01, e02, e03, e0123]);
};

/*
 * Ideal line * Point -> Multivector (e0, e032, e013, e021)
 * l∞ * P = l∞ ∙ P + l∞ ∧ P
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, the equivalent of a point inversely translated by
 * the ideal without regard to weight. Due to this, it should not be called and
 * the point should be translated by an appropriate Translator
*/
export const geometricIdealPoint = (a, b) => {
  const e0 = -(a[3] * b[3]);

  const e032 = -(a[0] * b[3]);
  const e013 = -(a[1] * b[3]);
  const e021 = -(a[2] * b[3]);

  return new Float32Array([e0, e032, e013, e021]);
};

/* === Origin line geometric products ===
 *
 * Origin line * Plane       -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
 * Origin line * Ideal line  -> Ideal line / Translator (e01, e02, e03, e0123)
 * Origin line * Origin line -> Rotor (e23, e31, e12, s)
 * Origin line * Line        -> Motor (e01, e02, e03, e0123, e23, e31, e12, s)
 * Origin line * Point       -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
*/

/*
 * Origin line * Plane -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
 * lο * p = lο ∙ p + lο ∧ p
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricOriginPlane = (a, b) => {
  const e1 = a[3] * b[0] - a[1] * b[2] + a[2] * b[1];
  const e2 = a[3] * b[1] - a[2] * b[0] + a[0] * b[2];
  const e3 = a[3] * b[2] - a[0] * b[1] + a[1] * b[0];
  const e0 = a[3] * b[3];

  const e032 = -(a[0] * b[3]);
  const e013 = -(a[1] * b[3]);
  const e021 = -(a[2] * b[3]);
  const e123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([0, e1, e2, e3, e0, 0, 0, 0, 0, 0, 0, e032, e013, e021, e123, 0]);
};

/*
 * Origin line * Ideal line -> Ideal line / Translator (e01, e02, e03, e0123)
 * lο * l∞ = lο ∙ l∞ + lο ∧ l∞
 * Composes the rotation and translation components of an origin and ideal
 * line, with weighting from both the scalar and pseudoscalar components
 * (a.e12 * b.e02 - a.e31 * b.e03) - (a.s * b.e01 + a.e23 * b.e0123) -> e01
 * (a.e23 * b.e03 - a.e12 * b.e01) - (a.s * b.e02 + a.e31 * b.e0123) -> e02
 * (a.e31 * b.e01 - a.e23 * b.e02) - (a.s * b.e03 + a.e12 * b.e0123) -> e03
 * (a.e23 * b.e01) + (a.e31 * b.e02) + (a.e12 * b.e03) + (a.s * b.e0123) -> e0123
*/
export const geometricOriginIdeal = (a, b) => {
  const e01 = a[2] * b[1] - a[1] * b[2] + a[3] * b[0] - a[0] * b[3];
  const e02 = a[0] * b[2] - a[2] * b[0] + a[3] * b[1] - a[1] * b[3];
  const e03 = a[1] * b[0] - a[0] * b[1] + a[3] * b[2] - a[2] * b[3];
  const e0123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

  return new Float32Array([e01, e02, e03, e0123]);
};

/*
 * Origin line * Origin line -> Rotor (e23, e31, e12, s)
 * lο * lο = lο ∙ lο + lο ∧ lο
 * Produces a rotor that, when normalized, moves lο₂ -> lο₁
 * (a.e12 * b.e31 - a.e31 * b.e12) + (a.e23 * b.s + a.s * b.e23) -> e23
 * (a.e23 * b.e12 - a.e12 * b.e23) + (a.e31 * b.s + a.s * b.e31) -> e31
 * (a.e31 * b.e23 - a.e23 * b.e31) + (a.e12 * b.s + a.s * b.e12) -> e12
 * (a.s * b.s) - (a.e23 * b.e23) - (a.e31 * b.e31) - (a.e12 * b.e12) -> s
*/
export const geometricOriginOrigin = (a, b) => {
  const e23 = a[2] * b[1] - a[1] * b[2] + a[0] * b[3] + a[3] * b[0];
  const e31 = a[0] * b[2] - a[2] * b[0] + a[1] * b[3] + a[3] * b[1];
  const e12 = a[1] * b[0] - a[0] * b[1] + a[2] * b[3] + a[3] * b[2];
  const s = a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2];

  return new Float32Array([e23, e31, e12, s]);
};

/*
 * Origin line * Line -> Motor (e01, e02, e03, e0123, e23, e31, e12, s)
 * lο * ℓ = lο ∙ ℓ + lο ∧ ℓ
 * Produces a motor that, when normalized, moves ℓ -> lο
 * (a.e12 * b.e02 - a.e31 * b.e03) - (a.s * b.e01 + a.e23 * b.e0123) -> e01
 * (a.e23 * b.e03 - a.e12 * b.e01) - (a.s * b.e02 + a.e31 * b.e0123) -> e02
 * (a.e31 * b.e01 - a.e23 * b.e02) - (a.s * b.e03 + a.e12 * b.e0123) -> e03
 * (a.e23 * b.e01) + (a.e31 * b.e02) + (a.e12 * b.e03) + (a.s * b.e0123) -> e0123
 * (a.e12 * b.e31 - a.e31 * b.e12) + (a.e23 * b.s + a.s * b.e23) -> e23
 * (a.e23 * b.e12 - a.e12 * b.e23) + (a.e31 * b.s + a.s * b.e31) -> e31
 * (a.e31 * b.e23 - a.e23 * b.e31) + (a.e12 * b.s + a.s * b.e12) -> e12
 * (a.s * b.s) - (a.e23 * b.e23) - (a.e31 * b.e31) - (a.e12 * b.e12) -> s
*/
export const geometricOriginLine = (a, b) => {
  const e01 = a[2] * b[1] - a[1] * b[2] + a[3] * b[0] - a[0] * b[3];
  const e02 = a[0] * b[2] - a[2] * b[0] + a[3] * b[1] - a[1] * b[3];
  const e03 = a[1] * b[0] - a[0] * b[1] + a[3] * b[2] - a[2] * b[3];
  const e0123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

  const e23 = a[2] * b[5] - a[1] * b[6] + a[0] * b[7] + a[3] * b[4];
  const e31 = a[0] * b[6] - a[2] * b[4] + a[1] * b[7] + a[3] * b[5];
  const e12 = a[1] * b[4] - a[0] * b[5] + a[2] * b[7] + a[3] * b[6];
  const s = a[3] * b[7] - a[0] * b[4] - a[1] * b[5] - a[2] * b[6];

  return new Float32Array([e01, e02, e03, e0123, e23, e31, e12, s]);
};

/*
 * Origin line * Point -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
 * lο * P = lο ∙ P + lο ∧ P
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricOriginPoint = (a, b) => {
  const e1 = -(a[0] * b[3]);
  const e2 = -(a[1] * b[3]);
  const e3 = -(a[2] * b[3]);
  const e0 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  const e032 = a[2] * b[1] - a[1] * b[2] + a[3] * b[0];
  const e013 = a[0] * b[2] - a[2] * b[0] + a[3] * b[1];
  const e021 = a[1] * b[0] - a[0] * b[1] + a[3] * b[2];
  const e123 = a[3] * b[3];

  return new Float32Array([0, e1, e2, e3, e0, 0, 0, 0, 0, 0, 0, e032, e013, e021, e123, 0]);
};

/* === Line geometric products ===
 *
 * Line * Plane       -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
 * Line * Ideal line  -> Ideal line / Translator (e01, e02, e03, e0123)
 * Line * Origin line -> Motor (e01, e02, e03, e0123, e23, e31, e12, s)
 * Line * Line        ->
 * Line * Point       -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
*/

/*
 * Line * Plane -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
 * ℓ * p = ℓ ∙ p + ℓ ∧ p
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricLinePlane = (a, b) => {
  const e1 = a[7] * b[0] - a[5] * b[2] + a[6] * b[1];
  const e2 = a[7] * b[1] - a[6] * b[0] + a[4] * b[2];
  const e3 = a[7] * b[2] - a[4] * b[1] + a[5] * b[0];
  const e0 = a[7] * b[3] + a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  const e032 = a[2] * b[1] - a[1] * b[2] - a[3] * b[0] - a[4] * b[3];
  const e013 = a[0] * b[2] - a[2] * b[0] - a[3] * b[1] - a[5] * b[3];
  const e021 = a[1] * b[0] - a[0] * b[1] - a[3] * b[2] - a[6] * b[3];
  const e123 = a[4] * b[0] + a[5] * b[1] + a[6] * b[2];

  return new Float32Array([0, e1, e2, e3, e0, 0, 0, 0, 0, 0, 0, e032, e013, e021, e123, 0]);
};

/*
 * Line * Ideal line -> Ideal line / Translator (e01, e02, e03, e0123)
 * ℓ * l∞ = ℓ ∙ l∞ + ℓ ∧ l∞
 * Composes the rotation and translation components of a line and an ideal,
 * with weighting from both the scalar and pseudoscalar components
 * (a.e12 * b.e02 - a.e31 * b.e03) - (a.e23 * b.e0123 + a.s * b.e01) -> e01
 * (a.e23 * b.e03 - a.e12 * b.e01) - (a.e31 * b.e0123 + a.s * b.e02) -> e02
 * (a.e31 * b.e01 - a.e23 * b.e02) - (a.e12 * b.e0123 + a.s * b.e03) -> e03
 * (a.e23 * b.e01) + (a.e31 * b.e02) + (a.e12 * b.e03) + (a.s * b.e0123) -> e0123
*/
export const geometricLineIdeal = (a, b) => {
  const e01 = a[6] * b[1] - a[5] * b[2] - a[4] * b[3] + a[7] * b[0];
  const e02 = a[4] * b[2] - a[6] * b[0] - a[5] * b[3] + a[7] * b[1];
  const e03 = a[5] * b[0] - a[4] * b[1] - a[6] * b[3] + a[7] * b[2];
  const e0123 = a[4] * b[0] + a[5] * b[1] + a[6] * b[2] + a[7] * b[3];

  return new Float32Array([e01, e02, e03, e0123]);
};

/*
 * Line * Origin line -> Motor (e01, e02, e03, e0123, e23, e31, e12, s)
 * ℓ * lο = ℓ ∙ lο + ℓ ∧ lο
 * Produces a motor that, when normalized, moves lο -> ℓ
 * (a.e03 * b.e31 - a.e02 * b.e12) - (a.e0123 * b.e23 + a.e01 * b.s) -> e01
 * (a.e01 * b.e12 - a.e03 * b.e23) - (a.e0123 * b.e31 + a.e02 * b.s) -> e02
 * (a.e02 * b.e23 - a.e01 * b.e31) - (a.e0123 * b.e12 + a.e03 * b.s) -> e03
 * (a.e01 * b.e23) + (a.e02 * b.e31) + (a.e03 * b.e12) + (a.e0123 * b.s) -> e0123
 * (a.e12 * b.e31 - a.e31 * b.e12) + (a.e23 * b.s + a.s * b.e23) -> e23
 * (a.e23 * b.e12 - a.e12 * b.e23) + (a.e31 * b.s + a.s * b.e31) -> e31
 * (a.e31 * b.e23 - a.e23 * b.e31) + (a.e12 * b.s + a.s * b.e12) -> e12
 * (a.s * b.s) - (a.e23 * b.e23) - (a.e31 * b.e31) - (a.e12 * b.e12) -> s
*/
export const geometricLineOrigin = (a, b) => {
  const e01 = a[2] * b[1] - a[1] * b[2] - a[3] * b[0] + a[0] * b[3];
  const e02 = a[0] * b[2] - a[2] * b[0] - a[3] * b[1] + a[1] * b[3];
  const e03 = a[1] * b[0] - a[0] * b[1] - a[3] * b[2] + a[2] * b[3];
  const e0123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

  const e23 = a[6] * b[1] - a[5] * b[2] + a[4] * b[3] + a[7] * b[0];
  const e31 = a[4] * b[2] - a[6] * b[0] + a[5] * b[3] + a[7] * b[1];
  const e12 = a[5] * b[0] - a[4] * b[1] + a[6] * b[3] + a[7] * b[2];
  const s = a[7] * b[3] - a[4] * b[0] - a[5] * b[1] - a[6] * b[2];

  return new Float32Array([e01, e02, e03, e0123, e23, e31, e12, s]);
};

/*
 * Origin line * Point -> Multivector (e1, e2, e3, e0, e032, e013, e021, e123)
 * ℓ * P = ℓ ∙ P + ℓ ∧ P
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricLinePoint = (a, b) => {
  const e1 = -(a[4] * b[3]);
  const e2 = -(a[5] * b[3]);
  const e3 = -(a[6] * b[3]);
  const e0 = a[4] * b[0] + a[5] * b[1] + a[6] * b[2] - a[3] * b[3];

  const e032 = a[6] * b[1] - a[5] * b[2] + a[7] * b[0] - a[0] * b[3];
  const e013 = a[4] * b[2] - a[6] * b[0] + a[7] * b[1] - a[1] * b[3];
  const e021 = a[5] * b[0] - a[4] * b[1] + a[7] * b[2] - a[2] * b[3];
  const e123 = a[7] * b[3];

  return new Float32Array([0, e1, e2, e3, e0, 0, 0, 0, 0, 0, 0, e032, e013, e021, e123, 0]);
};

/* === Point geometric products ===
 *
 * Point * Plane       -> Motor (e01, e02, e03, e0123, e23, e31, e12, 0)
 * Point * Ideal line  ->
 * Point * Origin line ->
 * Point * Line        ->
 * Point * Point       -> Translator (e01, e02, e03, s)
*/

/*
 * Point * Plane -> Motor (e01, e02, e03, e0123, e23, e31, e12, 0)
 * P * p = P ∙ p + P ∧ p
 * Identical to the inner and outer products, no cancellations, full product:
 * (a.e013 * b.e3 - a.e021 * b.e2) -> e01
 * (a.e021 * b.e1 - a.e032 * b.e3) -> e02
 * (a.e032 * b.e2 - a.e013 * b.e1) -> e03
 * (a.e1 * b.e032) + (a.e2 * b.e013) + (a.e3 * b.e021) + (a.e0 * b.e123) -> e0123
 * (a.e123 * b.e1) -> e23
 * (a.e123 * b.e2) -> e31
 * (a.e123 * b.e3) -> e12
*/
export const geometricPointPlane = (a, b) => {
  const e01 = a[1] * b[2] - a[2] * b[1];
  const e02 = a[2] * b[0] - a[0] * b[2];
  const e03 = a[0] * b[1] - a[1] * b[0];
  const e0123 = -(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]);

  const e23 = a[3] * b[0];
  const e31 = a[3] * b[1];
  const e12 = a[3] * b[2];

  return new Float32Array([e01, e02, e03, e0123, e23, e31, e12, 0]);
};

/*
 * Point * Point -> Translator (e01, e02, e03, s)
 * P * P = P ∙ P + P ∧ P
 * Produces a translator that, when normalized, moves P₂ -> P₁
 * -(a.e123 * b.e032 + a.e032 * b.123) -> e01
 * -(a.e123 * b.e013 + a.e013 * b.123) -> e02
 * -(a.e123 * b.e021 + a.e021 * b.123) -> e03
 * -((a.e123 * b.e123)) -> s
*/
export const geometricPointPoint = (a, b) => {
  const e01 = -(a[3] * b[0] - a[0] * b[3]);
  const e02 = -(a[3] * b[1] - a[1] * b[3]);
  const e03 = -(a[3] * b[2] - a[2] * b[3]);
  const s = -(a[3] * b[3]);

  return new Float32Array([e01, e02, e03, s]);
};

/* === Operation map === *
 *
 * Utility map for delegating elements to their proper geometric products, coupled
 * with the result element type, intended for use in '../PGA.js'
 *
 * { [Lhs]: [Rhs] -> [Operation, Result] }
*/
export const geometricProductMap = {
  [PGATypes.Plane]: {
    [PGATypes.Plane]: [geometricPlanePlane, PGATypes.Motor],
    [PGATypes.IdealLine]: [geometricPlaneIdeal, PGATypes.Multivector],
    [PGATypes.OriginLine]: [geometricPlaneOrigin, PGATypes.Multivector],
    [PGATypes.Line]: [geometricPlaneLine, PGATypes.Multivector],
    [PGATypes.Point]: [geometricPlanePoint, PGATypes.Motor],
  },
};
