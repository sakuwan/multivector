/* === PGA (3, 0, 1) regressive products (join) ===
 *
*/

/* === Plane regressive products === */

/*
 * Plane ∨ Plane       -> Vanishes completely
 * Plane ∨ Ideal line  -> Vanishes completely
 * Plane ∨ Origin line -> Vanishes completely
 * Plane ∨ Line        -> Vanishes completely
 * Plane ∨ Point       -> Scalar
*/

/*
 * Plane ∨ Point -> Scalar
 * Equivalent to J(J(p) ∧ J(P)) or (p* ∧ P*)*
 * The meet of a point and plane where the resulting pseudo-scalar is dualized
 *
 * Refer to 'outerPointPlane' for the reasoning of the meet
*/
export const regressivePlanePoint = (a, b) => (
  -(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3])
);

/* === Ideal line regressive products ===
 *
 * Ideal line ∨ Plane       -> Vanishes completely
 * Ideal line ∨ Ideal line  -> Vanishes completely
 * Ideal line ∨ Origin line -> Scalar
 * Ideal line ∨ Line        -> Scalar
 * Ideal line ∨ Point       -> Plane (e1, e2, e3, e0)
*/

/*
 * Ideal line ∨ Origin line -> Scalar
 * Equivalent to J(J(l∞) ∧ J(lο)) or (l∞* ∧ lο*)*
 * The meet of origin and ideal lines where the resulting pseudo-scalar is dualized
 *
 * Refer to 'outerOriginIdeal' for the reasoning of the meet
*/
export const regressiveIdealOrigin = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/*
 * Ideal line ∨ Line -> Scalar
 * Equivalent to J(J(l∞) ∧ J(ℓ)) or (l∞* ∧ ℓ*)*
 * The meet of origin and full lines where the resulting pseudo-scalar is dualized
 *
 * Refer to 'outerOriginLine' for the reasoning of the meet, the indices of
 * the ideal and origin are reversed for the dualized line
*/
export const regressiveIdealLine = (a, b) => (
  a[0] * b[4] + a[1] * b[5] + a[2] * b[6]
);

/*
 * Ideal line ∨ Point -> Plane (e1, e2, e3, e0)
 * Equivalent to J(J(l∞) ∧ J(P)) or (l∞* ∧ P*)*
 * The meet of an origin line and plane where the resulting point is dualized
 *
 * Refer to 'outerOriginPlane' for the reasoning of the meet
*/
export const regressiveIdealPoint = (a, b) => {
  const e1 = -(a[0] * b[3]);
  const e2 = -(a[1] * b[3]);
  const e3 = -(a[2] * b[3]);
  const e0 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e1, e2, e3, e0]);
};

/* === Origin line regressive products ===
 *
 * Origin line ∨ Plane       -> Vanishes completely
 * Origin line ∨ Ideal line  -> Scalar
 * Origin line ∨ Origin line -> Vanishes completely
 * Origin line ∨ Line        -> Scalar
 * Origin line ∨ Point       -> Plane(e1, e2, e3, 0)
*/

/*
 * Origin line ∨ Ideal line -> Scalar
 * Equivalent to J(J(lο) ∧ J(l∞)) or (lο* ∧ l∞*)*
 * The meet of ideal and origin lines where the resulting pseudo-scalar is dualized
 *
 * Refer to 'outerIdealOrigin' for the reasoning of the meet
*/
export const regressiveOriginIdeal = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/*
 * Origin line ∨ Line -> Scalar
 * Equivalent to J(J(lο) ∧ J(ℓ)) or (lο* ∧ ℓ*)*
 * The meet of ideal and full lines where the resulting pseudo-scalar is dualized
 *
 * Refer to 'outerIdealLine' for the reasoning of the meet, the indices of
 * the ideal and origin are reversed for the dualized line
*/
export const regressiveOriginLine = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/*
 * Origin line ∨ Point -> Plane(e1, e2, e3, 0)
 * Equivalent to J(J(lο) ∧ J(P)) or (lο* ∧ P*)*
 * The meet of an ideal line and plane where the resulting point is dualized
 *
 * Refer to 'outerIdealPlane' for the reasoning of the meet
*/
export const regressiveOriginPoint = (a, b) => {
  const e1 = a[2] * b[1] - a[1] * b[2];
  const e2 = a[0] * b[2] - a[2] * b[0];
  const e3 = a[1] * b[0] - a[0] * b[1];

  return new Float32Array([e1, e2, e3, 0]);
};

/* === Line regressive products ===
 *
 * Line ∨ Plane       -> Vanishes completely
 * Line ∨ Ideal line  -> Scalar
 * Line ∨ Origin line -> Scalar
 * Line ∨ Line        -> Scalar
 * Line ∨ Point       -> Plane (e1, e2, e3, e0)
*/

/*
 * Line ∨ Ideal line -> Scalar
 * Equivalent to J(J(ℓ) ∧ J(l∞)) or (ℓ* ∧ l∞*)*
 * The meet of a line and origin line where the resulting pseudo-scalar is dualized
 *
 * Refer to 'outerLineOrigin' for the reasoning of the meet, the indices of
 * the ideal and origin are reversed for the dualized line
*/
export const regressiveLineIdeal = (a, b) => (
  a[4] * b[0] + a[5] * b[1] + a[6] * b[2]
);

/*
 * Line ∨ Origin line -> Scalar
 * Equivalent to J(J(ℓ) ∧ J(lο)) or (ℓ* ∧ lο*)*
 * The meet of a line and ideal line where the resulting pseudo-scalar is dualized
 *
 * Refer to 'outerLineIdeal' for the reasoning of the meet, the indices of
 * the ideal and origin are reversed for the dualized line
*/
export const regressiveLineOrigin = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/*
 * Line ∨ Line -> Scalar
 * Equivalent to J(J(ℓ) ∧ J(ℓ)) or (ℓ* ∧ ℓ*)*
 * The meet of lines where the resulting pseudo-scalar is dualized
 *
 * Refer to 'outerLineLine' for the reasoning of the meet, the indices of both
 * lines are swapped, but the result is identical
*/
export const regressiveLineLine = (a, b) => (
  a[0] * b[4] + a[1] * b[5] + a[2] * b[6] + a[4] * b[0] + a[5] * b[1] + a[6] * b[2]
);

/*
 * Line ∨ Point -> Plane (e1, e2, e3, e0)
 * Equivalent to J(J(ℓ) ∧ J(P)) or (ℓ* ∧ P*)*
 * The meet of a line and plane where the resulting point is dualized
 *
 * Refer to 'outerLinePlane' for the reasoning of the meet, the indices of
 * the ideal and origin are reversed for the dualized line
*/
export const regressiveLinePoint = (a, b) => {
  const e1 = a[6] * b[1] - a[5] * b[2] - a[0] * b[3];
  const e2 = a[4] * b[2] - a[6] * b[0] - a[1] * b[3];
  const e3 = a[5] * b[0] - a[4] * b[1] - a[2] * b[3];
  const e0 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e1, e2, e3, e0]);
};

/* === Point regressive products ===
 *
 * Point ∨ Plane       -> Scalar
 * Point ∨ Ideal line  -> Plane (e1, e2, e3, e0)
 * Point ∨ Origin line -> Plane (e1, e2, e3, 0)
 * Point ∨ Line        -> Plane (e1, e2, e3, e0)
 * Point ∨ Point       -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
*/

/*
 * Point ∨ Plane -> Scalar
 * Equivalent to J(J(P) ∧ J(p)) or (P* ∧ p*)*
 * The meet of a plane and point where the resulting pseudo-scalar is dualized
 *
 * Refer to 'outerPlanePoint' for the reasoning of the meet
*/
export const regressivePointPlane = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
);

/*
 * Point ∨ Ideal line -> Plane (e1, e2, e3, e0)
 * Equivalent to J(J(P) ∧ J(l∞)) or (P* ∧ l∞*)*
 * The meet of a plane and origin line where the resulting point is dualized
 *
 * Refer to 'outerPlaneOrigin' for the reasoning of the meet
*/
export const regressivePointIdeal = (a, b) => {
  const e1 = -(a[3] * b[0]);
  const e2 = -(a[3] * b[1]);
  const e3 = -(a[3] * b[2]);
  const e0 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e1, e2, e3, e0]);
};

/*
 * Point ∨ Origin line -> Plane (e1, e2, e3, 0)
 * Equivalent to J(J(P) ∧ J(lο)) or (P* ∧ lο*)*
 * The meet of a plane and ideal line where the resulting point is dualized
 *
 * Refer to 'outerPlaneIdeal' for the reasoning of the meet
*/
export const regressivePointOrigin = (a, b) => {
  const e1 = a[1] * b[2] - a[2] * b[1];
  const e2 = a[2] * b[0] - a[0] * b[2];
  const e3 = a[0] * b[1] - a[1] * b[0];

  return new Float32Array([e1, e2, e3, 0]);
};

/*
 * Point ∨ Line -> Plane (e1, e2, e3, e0)
 * Equivalent to J(J(P) ∧ J(ℓ)) or (P* ∧ ℓ*)*
 * The meet of a plane and line where the resulting point is dualized
 *
 * Refer to 'outerPlaneLine' for the reasoning of the meet, the indices of
 * the ideal and origin are reversed for the dualized line
*/
export const regressivePointLine = (a, b) => {
  const e1 = a[1] * b[6] - a[2] * b[5] - a[3] * b[0];
  const e2 = a[2] * b[4] - a[0] * b[6] - a[3] * b[1];
  const e3 = a[0] * b[5] - a[1] * b[4] - a[3] * b[2];
  const e0 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e1, e2, e3, e0]);
};

/*
 * Point ∨ Point -> Ideal line (e01, e02, e03, 0)
 * Equivalent to J(J(P) ∧ J(P)) or (P* ∧ P*)*
 * The meet of a plane and plane where the resulting origin line
 * is extracted from the line and dualized
 *
 * Refer to 'outerPlanePlaneO' for the reasoning of the meet
*/
export const regressivePointPointI = (a, b) => {
  const e01 = a[1] * b[2] - a[2] * b[1];
  const e02 = a[2] * b[0] - a[0] * b[2];
  const e03 = a[0] * b[1] - a[1] * b[0];

  return new Float32Array([e01, e02, e03, 0]);
};

/*
 * Point ∨ Point -> Origin line (e23, e31, e12, 0)
 * Equivalent to J(J(P) ∧ J(P)) or (P* ∧ P*)*
 * The meet of a plane and plane where the resulting ideal line
 * is extracted from the line and dualized
 *
 * Refer to 'outerPlanePlaneI' for the reasoning of the meet
*/
export const regressivePointPointO = (a, b) => {
  const e23 = a[3] * b[0] - a[0] * b[3];
  const e31 = a[3] * b[1] - a[1] * b[3];
  const e12 = a[3] * b[2] - a[2] * b[3];

  return new Float32Array([e23, e31, e12, 0]);
};

/*
 * Point ∨ Point -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
 * Equivalent to J(J(P) ∧ J(P)) or (P* ∧ P*)*
 * The meet of a plane and plane where the resulting full line is dualized
 *
 * Refer to 'outerPlanePlane' for the reasoning of the meet
*/
export const regressivePointPoint = (a, b) => {
  const e01 = a[1] * b[2] - a[2] * b[1];
  const e02 = a[2] * b[0] - a[0] * b[2];
  const e03 = a[0] * b[1] - a[1] * b[0];

  const e23 = a[3] * b[0] - a[0] * b[3];
  const e31 = a[3] * b[1] - a[1] * b[3];
  const e12 = a[3] * b[2] - a[2] * b[3];

  return new Float32Array([e01, e02, e03, 0, e23, e31, e12, 0]);
};
