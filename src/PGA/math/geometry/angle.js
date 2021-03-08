/* === PGA (3, 0, 1) Metric relations - Angle ===
 *
 * Angles between intersecting elements or angles relative to the origin.
 * The angles between some elements, such as planes and lines, relies on
 * incidence and the assumption of normalization
*/

/*
 * angle(p₁, p₂) -> cos⁻¹(p₁ ∙ p₂)
 *
 * Angle of intersection of two planes
*/
export const anglePlanePlane = (a, b) => {
  const cosTheta = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);

  return (Math.abs(cosTheta) > 0.999999)
    ? Math.sign(cosTheta)
    : cosTheta;
};

/*
 * angle(p, ℓₒ) -> sin⁻¹(||<p * ℓₒ>₃||)
 *
 * Angle of intersection of a plane and origin line
*/
export const anglePlaneOrigin = (a, b) => {
  const sinTheta = Math.asin(-(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));

  return (Math.abs(sinTheta) > 0.999999)
    ? Math.sign(sinTheta)
    : sinTheta;
};

/*
 * angle(p, ℓ) -> sin⁻¹(||<p * ℓ>₃||)
 *
 * Angle of intersection of a plane and line
*/
export const anglePlaneLine = (a, b) => {
  const sinTheta = Math.asin(-(a[0] * b[4] + a[1] * b[5] + a[2] * b[6]));

  return (Math.abs(sinTheta) > 0.999999)
    ? Math.sign(sinTheta)
    : sinTheta;
};

/*
 * angle(p, P) -> sin⁻¹(||<p * P>₃||)
 *
 * Angle between a plane and point
*/
export const anglePlanePoint = (a, b) => {
  const sinTheta = Math.asin(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);

  return (Math.abs(sinTheta) > 0.999999)
    ? Math.sign(sinTheta)
    : sinTheta;
};
