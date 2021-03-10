/* === PGA (3, 0, 1) Metric relations - Angle ===
 *
 * Angles between intersecting elements or angles relative to the origin.
 * The angles between some elements, such as planes and lines, relies on
 * incidence and the assumption of normalization
*/

/* === Commonly used built-ins === */
const {
  abs,
  sign,
  acos, asin,
} = Math;

/* === Helper for inverse transcendentals === */
const roundNearBounds = (x) => (abs(x) > 0.999999 ? sign(x) : x);

/* === Plane metric angle ===
 *
 * Plane <-> Plane       -> Oriented towards normals
 * Plane <-> Origin line -> Oriented towards origin direction
 * Plane <-> Line        -> Oriented towards origin direction
 * Plane <-> Point       -> Oriented relative to origin point
*/

/*
 * angle(p₁, p₂) -> cos⁻¹(p₁ ∙ p₂)
 *
 * Angle of intersection of two planes (normals)
*/
export const anglePlanePlane = (a, b) => {
  if (a[0] === 0 && a[1] === 0 && a[2] === 0) return 0;
  if (b[0] === 0 && b[1] === 0 && b[2] === 0) return 0;

  return acos(roundNearBounds(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
};

/*
 * angle(p, ℓₒ) -> sin⁻¹(||<p * ℓₒ>₃||)
 *
 * Angle of intersection of a plane and origin line, in the direction of the
 * origin line
*/
export const anglePlaneOrigin = (a, b) => {
  if (a[0] === 0 && a[1] === 0 && a[2] === 0) return 0;
  if (b[0] === 0 && b[1] === 0 && b[2] === 0) return 0;

  return asin(roundNearBounds(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
};

/*
 * angle(p, ℓ) -> sin⁻¹(||<p * ℓ>₃||)
 *
 * Angle of intersection of a plane and line, in the direction of the origin
 * line
*/
export const anglePlaneLine = (a, b) => {
  if (a[0] === 0 && a[1] === 0 && a[2] === 0) return 0;
  if (b[4] === 0 && b[5] === 0 && b[6] === 0) return 0;

  return asin(roundNearBounds(a[0] * b[4] + a[1] * b[5] + a[2] * b[6]));
};

/*
 * angle(p, P) -> sin⁻¹(||<p * P>₃||)
 *
 * Angle between a plane and point, in the direction of the point relative
 * to the origin
*/
export const anglePlanePoint = (a, b) => {
  const infNorm = (b[0] * b[0] + b[1] * b[1] + b[2] * b[2]) ** 0.5;
  if (infNorm === 0 || (a[0] === 0 && a[1] === 0 && a[2] === 0)) return 0;

  const invNorm = (1.0 / infNorm);
  const e23 = b[0] * invNorm;
  const e31 = b[1] * invNorm;
  const e12 = b[2] * invNorm;

  return asin(roundNearBounds(a[0] * e23 + a[1] * e31 + a[2] * e12));
};

/* === Origin line metric angle ===
 *
 * Origin line <-> Plane       -> Oriented towards origin direction
 * Origin line <-> Origin line -> Oriented angle between origin directions
 * Origin line <-> Line        -> Oriented angle between origin directions
 * Origin line <-> Point       -> Oriented relative to origin point
*/

/*
 * angle(ℓₒ, p) -> sin⁻¹(||<ℓₒ * p>₃||)
 *
 * Angle of intersection of an origin line and plane, in the direction of the
 * origin line
*/
export const angleOriginPlane = (a, b) => {
  if (a[0] === 0 && a[1] === 0 && a[2] === 0) return 0;
  if (b[0] === 0 && b[1] === 0 && b[2] === 0) return 0;

  return asin(roundNearBounds(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
};

/*
 * angle(ℓₒ₁, ℓₒ₂) -> cos⁻¹(ℓₒ₁ ∙ ℓₒ₂)
 *
 * Angle of intersection between two origin lines
*/
export const angleOriginOrigin = (a, b) => {
  if (a[0] === 0 && a[1] === 0 && a[2] === 0) return 0;
  if (b[0] === 0 && b[1] === 0 && b[2] === 0) return 0;

  return acos(roundNearBounds(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
};

/*
 * angle(ℓₒ, ℓ) -> cos⁻¹(ℓₒ ∙ ℓ)
 *
 * Angle of intersection of an origin line and line
*/
export const angleOriginLine = (a, b) => {
  if (a[0] === 0 && a[1] === 0 && a[2] === 0) return 0;
  if (b[4] === 0 && b[5] === 0 && b[6] === 0) return 0;

  return acos(roundNearBounds(a[0] * b[4] + a[1] * b[5] + a[2] * b[6]));
};

/*
 * angle(ℓₒ, P) -> cos⁻¹(ℓₒ ∙ P)
 *
 * Angle of intersection of a origin line and point, in the direction of the
 * point relative to the origin
*/
export const angleOriginPoint = (a, b) => {
  const infNorm = (b[0] * b[0] + b[1] * b[1] + b[2] * b[2]) ** 0.5;
  if (infNorm === 0 || (a[0] === 0 && a[1] === 0 && a[2] === 0)) return 0;

  const invNorm = (1.0 / infNorm);
  const e23 = b[0] * invNorm;
  const e31 = b[1] * invNorm;
  const e12 = b[2] * invNorm;

  return acos(roundNearBounds(a[0] * e23 + a[1] * e31 + a[2] * e12));
};

/* === Line metric angle ===
 *
 * Line <-> Plane       -> Oriented towards origin direction
 * Line <-> Origin line -> Oriented angle between origin directions
 * Line <-> Line        -> Oriented angle between origin directions
 * Line <-> Point       -> Oriented relative to origin point
*/

/*
 * angle(ℓ, p) -> sin⁻¹(||<ℓ * p>₃||)
 *
 * Angle of intersection of a line and plane, in the direction of the origin
 * line
*/
export const angleLinePlane = (a, b) => {
  if (a[4] === 0 && a[5] === 0 && a[6] === 0) return 0;
  if (b[0] === 0 && b[1] === 0 && b[2] === 0) return 0;

  return asin(roundNearBounds(a[4] * b[0] + a[5] * b[1] + a[6] * b[2]));
};

/*
 * angle(ℓ, ℓₒ) -> cos⁻¹(ℓ ∙ ℓₒ)
 *
 * Angle of intersection of a line and an origin line
*/
export const angleLineOrigin = (a, b) => {
  if (a[4] === 0 && a[5] === 0 && a[6] === 0) return 0;
  if (b[0] === 0 && b[1] === 0 && b[2] === 0) return 0;

  return acos(roundNearBounds(a[4] * b[0] + a[5] * b[1] + a[6] * b[2]));
};

/*
 * angle(ℓ₁, ℓ₂) -> cos⁻¹(ℓ₁ ∙ ℓ₂)
 *
 * Angle of intersection of two lines (origin)
*/
export const angleLineLine = (a, b) => {
  if (a[4] === 0 && a[5] === 0 && a[6] === 0) return 0;
  if (b[4] === 0 && b[5] === 0 && b[6] === 0) return 0;

  return acos(roundNearBounds(a[4] * b[4] + a[5] * b[5] + a[6] * b[6]));
};

/*
 * angle(ℓ, P) -> cos⁻¹(ℓ ∙ P)
 *
 * Angle of intersection of a line and point, in the direction of the point
 * relative to the origin
*/
export const angleLinePoint = (a, b) => {
  const infNorm = (b[0] * b[0] + b[1] * b[1] + b[2] * b[2]) ** 0.5;
  if (infNorm === 0 || (a[4] === 0 && a[5] === 0 && a[6] === 0)) return 0;

  const invNorm = (1.0 / infNorm);
  const e23 = b[0] * invNorm;
  const e31 = b[1] * invNorm;
  const e12 = b[2] * invNorm;

  return acos(roundNearBounds(a[4] * e23 + a[5] * e31 + a[6] * e12));
};

/* === Point metric angle ===
 *
 * Point <-> Plane       -> Oriented relative to origin point
 * Point <-> Origin line -> Oriented relative to origin point
 * Point <-> Line        -> Oriented relative to origin point
 * Point <-> Point       -> Oriented relative to origin point
*/
/*
 * angle(P, p) -> sin⁻¹(||<P * p>₃||)
 *
 * Angle between a plane and point, in the direction of the point relative
 * to the origin
*/
export const anglePointPlane = (a, b) => {
  const infNorm = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5;
  if (infNorm === 0 || (b[0] === 0 && b[1] === 0 && b[2] === 0)) return 0;

  const invNorm = (1.0 / infNorm);
  const e23 = a[0] * invNorm;
  const e31 = a[1] * invNorm;
  const e12 = a[2] * invNorm;

  return asin(roundNearBounds(e23 * b[0] + e31 * b[1] + e12 * b[2]));
};

/*
 * angle(P, ℓₒ) -> cos⁻¹(P ∙ ℓₒ)
 *
 * Angle of intersection of a point and origin line, in the direction of the
 * point relative to the origin
*/
export const anglePointOrigin = (a, b) => {
  const infNorm = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5;
  if (infNorm === 0 || (b[0] === 0 && b[1] === 0 && b[2] === 0)) return 0;

  const invNorm = (1.0 / infNorm);
  const e23 = a[0] * invNorm;
  const e31 = a[1] * invNorm;
  const e12 = a[2] * invNorm;

  return acos(roundNearBounds(e23 * b[0] + e31 * b[1] + e12 * b[2]));
};

/*
 * angle(P, ℓ) -> cos⁻¹(P ∙ ℓ)
 *
 * Angle of intersection of a point and line, in the direction of the point
 * relative to the origin
*/
export const anglePointLine = (a, b) => {
  const infNorm = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5;
  if (infNorm === 0 || (b[4] === 0 && b[5] === 0 && b[6] === 0)) return 0;

  const invNorm = (1.0 / infNorm);
  const e23 = a[0] * invNorm;
  const e31 = a[1] * invNorm;
  const e12 = a[2] * invNorm;

  return acos(roundNearBounds(e23 * b[4] + e31 * b[5] + e12 * b[6]));
};

/*
 * angle(P₁, P₂) -> cos⁻¹(P₁ ∙ P₂)
 *
 * Angle between two points, in the direction relative towards the origin
*/
export const anglePointPoint = (a, b) => {
  const infNormA = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5;
  const infNormB = (b[0] * b[0] + b[1] * b[1] + b[2] * b[2]) ** 0.5;
  if (infNormA === 0 || infNormB === 0) return 0;

  const invNormA = (1.0 / infNormA);
  const e23a = a[0] * invNormA;
  const e31a = a[1] * invNormA;
  const e12a = a[2] * invNormA;

  const invNormB = (1.0 / infNormB);
  const e23b = b[0] * invNormB;
  const e31b = b[1] * invNormB;
  const e12b = b[2] * invNormB;

  return acos(roundNearBounds(e23a * e23b + e31a * e31b + e12a * e12b));
};
