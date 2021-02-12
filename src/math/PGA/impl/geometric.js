/* === PGA (3, 0, 1) geometric products ===
 *
*/

/* === Plane geometric products ===
 *
 * Plane * Plane       -> Line (e01, e02, e03, 0, e23, e31, e12, s)
 * Plane * Ideal line  -> Plane + Point (0, 0, 0, e0, e032, e013, e021, 0)
 * Plane * Origin line -> Plane + Point (e1, e2, e3, 0, e032, e013, e021, e123)
 * Plane * Line        -> Plane + Point (e1, e2, e3, e0, e032, e013, e021, e123)
 * Plane * Point       -> Line (e01, e02, e03, e0123, e23, e31, e12, 0)
*/

/*
 * Plane * Plane -> Ideal line (e01, e02, e03, 0)
 * p * p = p ∙ p + p ∧ p
 * Extract the ideal line portion of the full line result, identical to
 * p ∧ p -> l∞ and simplifies to:
 *
 * (a.e0 * b.e1 - a.e1 * b.e0) -> e01
 * (a.e0 * b.e2 - a.e2 * b.e0) -> e02
 * (a.e0 * b.e3 - a.e3 * b.e0) -> e03
*/
export const geometricPlanePlaneI = (a, b) => {
  const e01 = a[3] * b[0] - a[0] * b[3];
  const e02 = a[3] * b[1] - a[1] * b[3];
  const e03 = a[3] * b[2] - a[2] * b[3];

  return new Float32Array([e01, e02, e03, 0]);
};

/*
 * Plane * Plane -> Origin line (e23, e31, e12, s)
 * p * p = p ∙ p + p ∧ p
 * Extract the origin line portion of the full line result, identical to
 * p ∧ p -> p ∙ p + lο and simplifies to:
 *
 * (a.e0 * b.e1 - a.e1 * b.e0) -> e01
 * (a.e0 * b.e2 - a.e2 * b.e0) -> e02
 * (a.e0 * b.e3 - a.e3 * b.e0) -> e03
 * (a.e1 * b.e1) + (a.e2 * b.e2) + (a.e3 * b.e3) -> s
*/
export const geometricPlanePlaneO = (a, b) => {
  const e23 = a[1] * b[2] - a[2] * b[1];
  const e31 = a[2] * b[0] - a[0] * b[2];
  const e12 = a[0] * b[1] - a[1] * b[0];
  const s = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e23, e31, e12, s]);
};

/*
 * Plane * Plane -> Line (e01, e02, e03, 0, e23, e31, e12, s)
 * p * p = p ∙ p + p ∧ p
 * Identical to the inner and outer products, no cancellations, full product:
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
 * Plane * Ideal line -> Plane + Point (0, 0, 0, e0, e032, e013, e021, 0)
 * p * l∞ = p ∙ l∞ + p ∧ l∞
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricPlaneIdeal = () => {
  throw new TypeError('Invalid operation: p * l∞ results in a cross-element multivector');
};

/*
 * Plane * Origin line -> Plane + Point (e1, e2, e3, 0, e032, e013, e021, e123)
 * p * lο = p ∙ lο + p ∧ lο
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricPlaneOrigin = () => {
  throw new TypeError('Invalid operation: p * lο results in a cross-element multivector');
};

/*
 * Plane * Line -> Plane + Point (e1, e2, e3, e0, e032, e013, e021, e123)
 * p * ℓ = p ∙ ℓ + p ∧ ℓ
 * A valid operation that results in a multivector that is the combination
 * of multiple elements, while simply being equivalent to both the inner and
 * outer products individually. Due to this, it should not be called and
 * the particular element should be retreived from either product instead.
*/
export const geometricPlaneLine = () => {
  throw new TypeError('Invalid operation: p * ℓ results in a cross-element multivector');
};

/*
 * Plane * Point -> Line (e01, e02, e03, e0123, e23, e31, e12, 0)
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
 * Ideal line * Plane       ->
 * Ideal line * Ideal line  ->
 * Ideal line * Origin line ->
 * Ideal line * Line        ->
 * Ideal line * Point       ->
*/

/* === Origin line geometric products ===
 *
 * Origin line * Plane       ->
 * Origin line * Ideal line  ->
 * Origin line * Origin line ->
 * Origin line * Line        ->
 * Origin line * Point       ->
*/

/* === Line geometric products ===
 *
 * Line * Plane       ->
 * Line * Ideal line  ->
 * Line * Origin line ->
 * Line * Line        ->
 * Line * Point       ->
*/

/* === Point geometric products ===
 *
 * Point * Plane       ->
 * Point * Ideal line  ->
 * Point * Origin line ->
 * Point * Line        ->
 * Point * Point       ->
*/
