/*
 * PGA (3, 0, 1) outer products
*/

/* === Plane outer products === */

/*
 * Plane ∧ Plane  -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
 * Plane ∧ Ideal  -> Point (e032, e013, e021, 0)
 * Plane ∧ Origin -> Point (e032, e013, e021, e123)
 * Plane ∧ Line   -> Point (e032, e013, e021, e123)
 * Plane ∧ Point  -> Pseudo-scalar
*/

export const outerPlanePlaneI = (a, b) => {
  const e01 = a[3] * b[0] - a[0] * b[3];
  const e02 = a[3] * b[1] - a[1] * b[3];
  const e03 = a[3] * b[2] - a[2] * b[3];

  return new Float32Array([e01, e02, e03, 0]);
};

export const outerPlanePlaneO = (a, b) => {
  const e23 = a[1] * b[2] - a[2] * b[1];
  const e31 = a[2] * b[0] - a[0] * b[2];
  const e12 = a[0] * b[1] - a[1] * b[0];

  return new Float32Array([e23, e31, e12, 0]);
};

export const outerPlanePlane = (a, b) => {
  const e01 = a[3] * b[0] - a[0] * b[3];
  const e02 = a[3] * b[1] - a[1] * b[3];
  const e03 = a[3] * b[2] - a[2] * b[3];

  const e23 = a[1] * b[2] - a[2] * b[1];
  const e31 = a[2] * b[0] - a[0] * b[2];
  const e12 = a[0] * b[1] - a[1] * b[0];

  return new Float32Array([e01, e02, e03, 0, e23, e31, e12, 0]);
};

export const outerPlaneIdeal = (a, b) => {
  const e032 = a[1] * b[2] - a[2] * b[1];
  const e013 = a[2] * b[0] - a[0] * b[2];
  const e021 = a[0] * b[1] - a[1] * b[0];

  return new Float32Array([e032, e013, e021, 0]);
};

export const outerPlaneOrigin = (a, b) => {
  const e032 = -(a[3] * b[0]);
  const e013 = -(a[3] * b[1]);
  const e021 = -(a[3] * b[2]);
  const e123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e032, e013, e021, e123]);
};

export const outerPlaneLine = (a, b) => {
  const e032 = a[1] * b[2] - a[2] * b[1] - a[3] * b[4];
  const e013 = a[2] * b[0] - a[0] * b[2] - a[3] * b[5];
  const e021 = a[0] * b[1] - a[1] * b[0] - a[3] * b[6];
  const e123 = a[0] * b[4] + a[1] * b[5] + a[2] * b[6];

  return new Float32Array([e032, e013, e021, e123]);
};

export const outerPlanePoint = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
);

/* === Ideal outer products === */

/*
 * Ideal ∧ Plane  -> Plane (0, 0, 0, e0)
 * Ideal ∧ Ideal  -> Vanishes completely
 * Ideal ∧ Origin -> Pseudo-scalar
 * Ideal ∧ Line   -> Pseudo-scalar
 * Ideal ∧ Point  -> Vanishes completely
*/

export const outerIdealPlane = (a, b) => {
  const e032 = a[2] * b[1] - a[1] * b[2];
  const e013 = a[0] * b[2] - a[2] * b[0];
  const e021 = a[1] * b[0] - a[0] * b[1];

  return new Float32Array([e032, e013, e021, 0]);
};

export const outerIdealOrigin = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

export const outerIdealLine = (a, b) => (
  a[0] * b[4] + a[1] * b[5] + a[2] * b[6]
);

/* === Origin outer products === */

/*
 * Origin ∧ Plane  -> Point (e032, e013, e021, e123)
 * Origin ∧ Ideal  -> Pseudo-scalar
 * Origin ∧ Origin -> Vanishes completely
 * Origin ∧ Line   -> Pseudo-scalar
 * Origin ∧ Point  -> Vanishes completely
*/

export const outerOriginPlane = (a, b) => {
  const e032 = -(a[0] * b[3]);
  const e013 = -(a[1] * b[3]);
  const e021 = -(a[2] * b[3]);
  const e123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e032, e013, e021, e123]);
};

export const outerOriginIdeal = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

export const outerOriginLine = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/* === Line outer products === */

/*
 * Line ∧ Plane  -> Point (e032, e013, e021, e123)
 * Line ∧ Ideal  -> Pseudo-scalar
 * Line ∧ Origin -> Pseudo-scalar
 * Line ∧ Line   -> Pseudo-scalar
 * Line ∧ Point  -> Vanishes completely
*/

export const outerLinePlane = (a, b) => {
  const e032 = a[2] * b[1] - a[1] * b[2] - a[4] * b[3];
  const e013 = a[0] * b[2] - a[2] * b[0] - a[5] * b[3];
  const e021 = a[1] * b[0] - a[0] * b[1] - a[6] * b[3];
  const e123 = a[4] * b[0] + a[5] * b[1] + a[6] * b[2];

  return new Float32Array([e032, e013, e021, e123]);
};

export const outerLineIdeal = (a, b) => (
  a[4] * b[0] + a[5] * b[1] + a[6] * b[2]
);

export const outerLineOrigin = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

export const outerLineLine = (a, b) => (
  a[0] * b[4] + a[1] * b[5] + a[2] * b[6] + a[4] * b[0] + a[5] * b[1] + a[6] * b[2]
);

/* === Point outer products === */

/*
 * Point ∧ Plane  -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
 * Point ∧ Ideal  -> Vanishes completely
 * Point ∧ Origin -> Vanishes completely
 * Point ∧ Line   -> Vanishes completely
 * Point ∧ Point  -> Vanishes completely
*/

export const outerPointPlane = (a, b) => (
  -(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3])
);
