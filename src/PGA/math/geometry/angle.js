/* === PGA (3, 0, 1) Metric relations - Angle ===
 *
 * Angles between intersecting elements or angles relative to the origin.
 * The angles between some elements, such as planes and lines, relies on
 * incidence and the assumption of normalization
*/

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
  const cosTheta = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
  if (cosTheta === 0) return 0;

  return Math.acos(Math.abs(cosTheta) > 0.999999 ? Math.sign(cosTheta) : cosTheta);
};

/*
 * angle(p, ℓₒ) -> sin⁻¹(||<p * ℓₒ>₃||)
 *
 * Angle of intersection of a plane and origin line, in the direction of the
 * origin line
*/
export const anglePlaneOrigin = (a, b) => {
  const sinTheta = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
  if (sinTheta === 0) return 0;

  return Math.asin(Math.abs(sinTheta) > 0.999999 ? Math.sign(sinTheta) : sinTheta);
};

/*
 * angle(p, ℓ) -> sin⁻¹(||<p * ℓ>₃||)
 *
 * Angle of intersection of a plane and line, in the direction of the origin
 * line
*/
export const anglePlaneLine = (a, b) => {
  const sinTheta = (a[0] * b[4] + a[1] * b[5] + a[2] * b[6]);
  if (sinTheta === 0) return 0;

  return Math.asin(Math.abs(sinTheta) > 0.999999 ? Math.sign(sinTheta) : sinTheta);
};

/*
 * angle(p, P) -> sin⁻¹(||<p * P>₃||)
 *
 * Angle between a plane and point, in the direction of the point relative
 * to the origin
*/
export const anglePlanePoint = (a, b) => {
  const infNormP = (b[0] * b[0] + b[1] * b[1] + b[2] * b[2]) ** 0.5;
  if (infNormP === 0) return 0;

  const invNorm = (1.0 / infNormP);

  const e23 = b[0] * invNorm;
  const e31 = b[1] * invNorm;
  const e12 = b[2] * invNorm;
  const sinTheta = (a[0] * e23 + a[1] * e31 + a[2] * e12);

  return Math.asin(Math.abs(sinTheta) > 0.999999 ? Math.sign(sinTheta) : sinTheta);
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
  const sinTheta = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
  if (sinTheta === 0) return 0;

  return Math.asin(Math.abs(sinTheta) > 0.999999 ? Math.sign(sinTheta) : sinTheta);
};

/*
 * angle(ℓₒ₁, ℓₒ₂) -> cos⁻¹(ℓₒ₁ ∙ ℓₒ₂)
 *
 * Angle of intersection between two origin lines
*/
export const angleOriginOrigin = (a, b) => {
  const cosTheta = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
  if (cosTheta === 0) return 0;

  return Math.acos(Math.abs(cosTheta) > 0.999999 ? Math.sign(cosTheta) : cosTheta);
};

/*
 * angle(ℓₒ, ℓ) -> cos⁻¹(ℓₒ ∙ ℓ)
 *
 * Angle of intersection of an origin line and line
*/
export const angleOriginLine = (a, b) => {
  const cosTheta = (a[0] * b[4] + a[1] * b[5] + a[2] * b[6]);
  if (cosTheta === 0) return 0;

  return Math.acos(Math.abs(cosTheta) > 0.999999 ? Math.sign(cosTheta) : cosTheta);
};

/*
 * angle(ℓₒ, P) -> cos⁻¹(ℓₒ ∙ P)
 *
 * Angle of intersection of a origin line and point, in the direction of the
 * point relative to the origin
*/
export const angleOriginPoint = (a, b) => {
  const infNormP = (b[0] * b[0] + b[1] * b[1] + b[2] * b[2]) ** 0.5;
  if (infNormP === 0) return 0;

  const invNorm = (1.0 / infNormP);

  const e23 = b[0] * invNorm;
  const e31 = b[1] * invNorm;
  const e12 = b[2] * invNorm;
  const cosTheta = (a[4] * e23 + a[5] * e31 + a[6] * e12);
  if (cosTheta === 0) return 0;

  return Math.acos(Math.abs(cosTheta) > 0.999999 ? Math.sign(cosTheta) : cosTheta);
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
  const sinTheta = (a[4] * b[0] + a[5] * b[1] + a[6] * b[2]);
  if (sinTheta === 0) return 0;

  return Math.asin(Math.abs(sinTheta) > 0.999999 ? Math.sign(sinTheta) : sinTheta);
};

/*
 * angle(ℓ, ℓₒ) -> cos⁻¹(ℓ ∙ ℓₒ)
 *
 * Angle of intersection of a line and an origin line
*/
export const angleLineOrigin = (a, b) => {
  const cosTheta = (a[4] * b[0] + a[5] * b[1] + a[6] * b[2]);
  if (cosTheta === 0) return 0;

  return Math.acos(Math.abs(cosTheta) > 0.999999 ? Math.sign(cosTheta) : cosTheta);
};

/*
 * angle(ℓ₁, ℓ₂) -> cos⁻¹(ℓ₁ ∙ ℓ₂)
 *
 * Angle of intersection of two lines (origin)
*/
export const angleLineLine = (a, b) => {
  const cosTheta = (a[4] * b[4] + a[5] * b[5] + a[6] * b[6]);
  if (cosTheta === 0) return 0;

  return Math.acos(Math.abs(cosTheta) > 0.999999 ? Math.sign(cosTheta) : cosTheta);
};

/*
 * angle(ℓ, P) -> cos⁻¹(ℓ ∙ P)
 *
 * Angle of intersection of a line and point, in the direction of the point
 * relative to the origin
*/
export const angleLinePoint = (a, b) => {
  const infNormP = (b[0] * b[0] + b[1] * b[1] + b[2] * b[2]) ** 0.5;
  if (infNormP === 0) return 0;

  const invNorm = (1.0 / infNormP);

  const e23 = b[0] * invNorm;
  const e31 = b[1] * invNorm;
  const e12 = b[2] * invNorm;
  const cosTheta = (a[4] * e23 + a[5] * e31 + a[6] * e12);
  if (cosTheta === 0) return 0;

  return Math.acos(Math.abs(cosTheta) > 0.999999 ? Math.sign(cosTheta) : cosTheta);
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
  const infNormP = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5;
  if (infNormP === 0) return 0;

  const invNorm = (1.0 / infNormP);

  const e23 = a[0] * invNorm;
  const e31 = a[1] * invNorm;
  const e12 = a[2] * invNorm;
  const sinTheta = (e23 * b[0] + e31 * b[1] + e12 * b[2]);

  return Math.asin(Math.abs(sinTheta) > 0.999999 ? Math.sign(sinTheta) : sinTheta);
};

/*
 * angle(P, ℓₒ) -> cos⁻¹(P ∙ ℓₒ)
 *
 * Angle of intersection of a point and origin line, in the direction of the
 * point relative to the origin
*/
export const anglePointOrigin = (a, b) => {
  const infNormP = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5;
  if (infNormP === 0) return 0;

  const invNorm = (1.0 / infNormP);

  const e23 = a[0] * invNorm;
  const e31 = a[1] * invNorm;
  const e12 = a[2] * invNorm;
  const cosTheta = (e23 * b[0] + e31 * b[1] + e12 * b[2]);

  return Math.acos(Math.abs(cosTheta) > 0.999999 ? Math.sign(cosTheta) : cosTheta);
};

/*
 * angle(P, ℓ) -> cos⁻¹(P ∙ ℓ)
 *
 * Angle of intersection of a point and line, in the direction of the point
 * relative to the origin
*/
export const anglePointLine = (a, b) => {
  const infNormP = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5;
  if (infNormP === 0) return 0;

  const invNorm = (1.0 / infNormP);

  const e23 = a[0] * invNorm;
  const e31 = a[1] * invNorm;
  const e12 = a[2] * invNorm;
  const cosTheta = (e23 * b[4] + e31 * b[5] + e12 * b[6]);

  return Math.acos(Math.abs(cosTheta) > 0.999999 ? Math.sign(cosTheta) : cosTheta);
};

/*
 * angle(P₁, P₂) -> cos⁻¹(P₁ ∙ P₂)
 *
 * Angle between two points, in the direction relative towards the origin
*/
export const anglePointPoint = (a, b) => {
  const infNormPA = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5;
  const infNormPB = (b[0] * b[0] + b[1] * b[1] + b[2] * b[2]) ** 0.5;
  if ((infNormPA === 0) || (infNormPB === 0)) return 0;

  const invNormA = (1.0 / infNormPA);
  const invNormB = (1.0 / infNormPB);

  const e23a = a[0] * invNormA;
  const e31a = a[1] * invNormA;
  const e12a = a[2] * invNormA;
  const e23b = b[0] * invNormB;
  const e31b = b[1] * invNormB;
  const e12b = b[2] * invNormB;
  const cosTheta = (e23a * e23b + e31a * e31b + e12a * e12b);

  return Math.acos(Math.abs(cosTheta) > 0.999999 ? Math.sign(cosTheta) : cosTheta);
};
