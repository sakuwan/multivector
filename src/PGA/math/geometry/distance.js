/* === PGA (3, 0, 1) Metric relations - Distance ===
 *
 * Oriented metric distances between fundamental PGA elements. The distance
 * between some elements, such as planes and lines, relies on the assumption
 * of being parallel and normalization
*/

/*
 * Unoriented
 * dist(p₁, p₂) -> ||p₁ ∧ p₂||∞
 *
 * Infinity norm of the meet of two parallel planes
*/
export const distancePlanePlane = (a, b) => {
  const e01 = a[3] * b[0] - a[0] * b[3];
  const e02 = a[3] * b[1] - a[1] * b[3];
  const e03 = a[3] * b[2] - a[2] * b[3];

  return (e01 * e01 + e02 * e02 + e03 * e03) ** 0.5;
};

/*
 * Unoriented
 * dist(p, ℓ) -> ||<p * ℓ>₃||∞
 *
 * Infinity norm of the grade-3 elements of the geometric product of a plane
 * and line
*/
export const distancePlaneLine = (a, b) => {
  const e032 = a[1] * b[2] - a[2] * b[1] + a[0] * b[3] - a[3] * b[4];
  const e013 = a[2] * b[0] - a[0] * b[2] + a[1] * b[3] - a[3] * b[5];
  const e021 = a[0] * b[1] - a[1] * b[0] + a[2] * b[3] - a[3] * b[6];

  return (e032 * e032 + e013 * e013 + e021 * e021) ** 0.5;
};

/*
 * Oriented
 * dist(p, P) -> ||p ∧ P||∞
 *
 * Infinity norm of the meet of a plane and point, or simply the join
*/
export const distancePlanePoint = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
);

/*
 * Unoriented
 * dist(ℓ, p) -> ||<ℓ * p>₃||∞
 *
 * Infinity norm of the grade-3 elements of the geometric product of a line
 * and plane
*/
export const distanceLinePlane = (a, b) => {
  const e032 = a[2] * b[1] - a[1] * b[2] - a[3] * b[0] - a[4] * b[3];
  const e013 = a[0] * b[2] - a[2] * b[0] - a[3] * b[1] - a[5] * b[3];
  const e021 = a[1] * b[0] - a[0] * b[1] - a[3] * b[2] - a[6] * b[3];

  return (e032 * e032 + e013 * e013 + e021 * e021) ** 0.5;
};

/*
 * Unoriented
 * dist(ℓ₁, ℓ₂) -> ||ℓ₁ * ℓ₂||∞
 *
 * Infinity norm of the geometric product of two parallel lines
*/
export const distanceLineLine = (a, b) => {
  const e01 = a[2] * b[5] - a[1] * b[6] - a[3] * b[4] + a[0] * b[7]
            + a[6] * b[1] - a[5] * b[2] - a[4] * b[3] + a[7] * b[0];

  const e02 = a[0] * b[6] - a[2] * b[4] - a[3] * b[5] + a[1] * b[7]
            + a[4] * b[2] - a[6] * b[0] - a[5] * b[3] + a[7] * b[1];

  const e03 = a[1] * b[4] - a[0] * b[5] - a[3] * b[6] + a[2] * b[7]
            + a[5] * b[0] - a[4] * b[1] - a[6] * b[3] + a[7] * b[2];

  const e0123 = a[0] * b[4] + a[1] * b[5] + a[2] * b[6] + a[3] * b[7]
              + a[4] * b[0] + a[5] * b[1] + a[6] * b[2] + a[7] * b[3];

  return (e01 * e01 + e02 * e02 + e03 * e03 + e0123 * e0123) ** 0.5;
};

/*
 * Oriented
 * dist(ℓ, P) -> ||ℓ ∨ P||
 *
 * Norm of the join of a line and point
*/
export const distanceLinePoint = (a, b) => {
  const e1 = a[6] * b[1] - a[5] * b[2] - a[0] * b[3];
  const e2 = a[4] * b[2] - a[6] * b[0] - a[1] * b[3];
  const e3 = a[5] * b[0] - a[4] * b[1] - a[2] * b[3];

  return (e1 * e1 + e2 * e2 + e3 * e3) ** 0.5;
};

/*
 * Oriented
 * dist(P, p) -> ||P ∧ p||∞
 *
 * Infinity norm of the meet of a point and plane, or simply the join
*/
export const distancePointPlane = (a, b) => (
  -(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3])
);

/*
 * Oriented
 * dist(P, ℓ) -> ||P ∨ ℓ||
 *
 * Norm of the join of a point and line
*/
export const distancePointLine = (a, b) => {
  const e1 = a[1] * b[6] - a[2] * b[5] - a[3] * b[0];
  const e2 = a[2] * b[4] - a[0] * b[6] - a[3] * b[1];
  const e3 = a[0] * b[5] - a[1] * b[4] - a[3] * b[2];

  return (e1 * e1 + e2 * e2 + e3 * e3) ** 0.5;
};

/*
 * Unoriented
 * dist(P₁, P₂) -> ||P₁ - P₂||∞
 *
 * Infinity norm of the difference between two points
 * Many methods exist for this particular distance, such as the norm of the
 * join or the infinity norm of the commutator
*/
export const distancePointPoint = (a, b) => {
  const e032 = a[0] - b[0];
  const e013 = a[1] - b[1];
  const e021 = a[2] - b[2];

  return (e032 * e032 + e013 * e013 + e021 * e021) ** 0.5;
};
