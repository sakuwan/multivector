/*
 * Commutativity matters, the following assumes a ∙ b
*/

/* === Plane inner products === */

/*
 * Plane ∙ Plane  -> Scalar
 * Plane ∙ Ideal  -> Plane (0, 0, 0, e0)
 * Plane ∙ Origin -> Plane (e1, e2, e3, 0)
 * Plane ∙ Line   -> Plane (e1, e2, e3, e0)
 * Plane ∙ Point  -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
*/

/*
 * Plane ∙ Plane -> Scalar
 * e0 vanishes, simplifying to:
 * (a.e1 * b.e1) + (a.e2 * b.e2) + (a.e3 * b.e3)
*/
export const innerPlanePlane = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/*
 * Plane ∙ Ideal line -> Plane (0, 0, 0, e0)
 * All components vanish except for e0 (assuming pseudo is 0), simplifying to:
 * -((a.e1 * b.e01) + (a.e2 * b.e02) + (a.e3 * b.e03))
*/
export const innerPlaneIdeal = (a, b) => (
  -(a[0] * b[0] + a[1] * b[1] + a[2] * b[2])
);

/*
 * Plane ∙ Origin line -> Plane (e1, e2, e3, 0)
 * e0 vanishes, simplifying to:
 * (a.e3 * b.e31 - a.e2 * b.e12) -> e1
 * (a.e1 * b.e12 - a.e3 * b.e23) -> e2
 * (a.e2 * b.e23 - a.e1 * b.e31) -> e3
*/
export const innerPlaneOrigin = (a, b) => {
  const e1 = a[2] * b[1] - a[1] * b[2];
  const e2 = a[0] * b[2] - a[2] * b[0];
  const e3 = a[1] * b[0] - a[0] * b[1];

  return new Float32Array([e1, e2, e3, 0]);
};

/*
 * Plane ∙ Line -> Plane (e1, e2, e3, e0)
 * Combination of the above, full plane-line inner product
*/
export const innerPlaneLine = (a, b) => {
  const e1 = a[2] * b[5] - a[1] * b[6]; // Offset b by 4 due to origin being
  const e2 = a[0] * b[6] - a[2] * b[4]; // indices 4-7
  const e3 = a[1] * b[4] - a[0] * b[5];
  const e0 = -(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);

  return new Float32Array([e1, e2, e3, e0]);
};

/*
 * Plane ∙ Point -> Ideal line (e01, e02, e03, 0)
 * Components are the intersections with the ideal plane, simplifying to:
 * (a.e3 * b.e013 - a.e2 * b.e021) -> e01
 * (a.e1 * b.e021 - a.e3 * b.e032) -> e02
 * (a.e2 * b.e032 - a.e1 * b.e013) -> e03
*/
export const innerPlanePointI = (a, b) => {
  const e01 = a[2] * b[1] - a[1] * b[2];
  const e02 = a[0] * b[2] - a[2] * b[0];
  const e03 = a[1] * b[0] - a[0] * b[1];

  return new Float32Array([e01, e02, e03, 0]);
};

/*
 * Plane ∙ Point -> Origin line (e23, e31, e12, 0)
 * Components are the pure Euclidean description of direction, simplifying to:
 * (a.e1 * b.e123) -> e23
 * (a.e2 * b.e123) -> e31
 * (a.e3 * b.e123) -> e12
*/
export const innerPlanePointO = (a, b) => {
  const e23 = a[0] * b[3];
  const e31 = a[1] * b[3];
  const e12 = a[2] * b[3];

  return new Float32Array([e23, e31, e12, 0]);
};

/*
 * Plane ∙ Point -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
 * Combination of the above, full plane-point inner product
*/
export const innerPlanePoint = (a, b) => {
  const e01 = a[2] * b[1] - a[1] * b[2];
  const e02 = a[0] * b[2] - a[2] * b[0];
  const e03 = a[1] * b[0] - a[0] * b[1];

  const e23 = a[0] * b[3];
  const e31 = a[1] * b[3];
  const e12 = a[2] * b[3];

  return new Float32Array([e01, e02, e03, 0, e23, e31, e12, 0]);
};

/* === Origin inner products === */

/*
 * Origin ∙ Plane  -> Plane (e1, e2, e3, 0)
 * Origin ∙ Ideal  -> Vanishes completely (assuming pseudo is 0)
 * Origin ∙ Origin -> Origin line (0, 0, 0, s)
 * Origin ∙ Line   -> Origin line (0, 0, 0, s)
 * Origin ∙ Point
*/

/*
 * Origin ∙ Plane -> Plane (e1, e2, e3, 0)
 * e0 vanishes, simplifying to:
 * (a.e2 * b.e31 - a.e3 * b.e12) -> e1
 * (a.e3 * b.e12 - a.e1 * b.e23) -> e2
 * (a.e1 * b.e23 - a.e2 * b.e31) -> e3
*/
export const innerOriginPlane = (a, b) => {
  const e1 = a[1] * b[1] - a[2] * b[2];
  const e2 = a[2] * b[2] - a[0] * b[0];
  const e3 = a[0] * b[0] - a[1] * b[1];

  return new Float32Array([e1, e2, e3, 0]);
};

/*
 * Origin line ∙ Origin line -> Origin line (0, 0, 0, s)
 * All components vanish except for s, simplifying to:
 * -((a.e23 * b.e23) + (a.e31 * b.e31) + (a.12 * b.e12))
*/
export const innerOriginOrigin = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/*
 * Origin line ∙ Line -> Origin line (0, 0, 0, s)
 * All components vanish except for s, simplifying to:
 * -((a.e23 * b.e23) + (a.e31 * b.e31) + (a.12 * b.e12))
*/
export const innerOriginLine = (a, b) => (
  a[0] * b[4] + a[1] * b[5] + a[2] * b[6] // Offset by 4 for indices 4-7
);

/*
 * Origin line ∙ Point -> Plane (e1, e2, e3, e0)
 * Components are the plane that is orthogonal to the line and
 * intersecting the point, simplifying to:
 * -((a.e23 * b.e123)) -> e1
 * -((a.e31 * b.e123)) -> e2
 * -((a.e12 * b.e123)) -> e3
 * (a.e23 * b.e032) + (a.e31 * b.e013) + (a.e12 * b.e021) -> e0
*/
export const innerOriginPoint = (a, b) => {
  const e1 = -(a[0] * b[3]);
  const e2 = -(a[1] * b[3]);
  const e3 = -(a[2] * b[3]);
  const e0 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e1, e2, e3, e0]);
};

/* === Ideal inner products === */

/*
 * Ideal ∙ Plane
 * Ideal ∙ Ideal  -> Vanishes completely
 * Ideal ∙ Origin -> Vanishes completely (assuming pseudo is 0)
 * Ideal ∙ Line   -> Vanishes completely (assuming pseudo is 0)
 * Ideal ∙ Point
*/

/*
 * Ideal line ∙ Plane -> Plane (0, 0, 0, e0)
 * All components vanish except for e0 (assuming pseudo is 0), simplifying to:
 * (a.e1 * b.e01) + (a.e2 * b.e02) + (a.e3 * b.e03)
*/
export const innerIdealPlane = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/* === Point inner products === */

/*
 * Point ∙ Plane
 * Point ∙ Ideal
 * Point ∙ Origin
 * Point ∙ Line
 * Point ∙ Point
*/

/*
 * Point ∙ Point -> Scalar
 * All components vanish except e123, simplifying to:
 * -(a.e123 * b.e123)
*/
export const innerPointPoint = (a, b) => (
  -(a[3] * b[3])
);
