/* === PGA (3, 0, 1) inner products ===
 *
 * Commutativity matters, the following assumes a ∙ b
*/

/* === Plane inner products ===
 *
 * Plane ∙ Plane       -> Scalar
 * Plane ∙ Ideal line  -> Plane (0, 0, 0, e0)
 * Plane ∙ Origin line -> Plane (e1, e2, e3, 0)
 * Plane ∙ Line        -> Plane (e1, e2, e3, e0)
 * Plane ∙ Point       -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
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

/* === Ideal line inner products ===
 *
 * Ideal line ∙ Plane       -> Plane (0, 0, 0, e0)
 * Ideal line ∙ Ideal line  -> Vanishes completely
 * Ideal line ∙ Origin line -> Vanishes completely (assuming pseudo is 0)
 * Ideal line ∙ Line        -> Vanishes completely (assuming pseudo is 0)
 * Ideal line ∙ Point       -> Vanishes completely (assuming pseudo is 0)
*/

/*
 * Ideal line ∙ Plane -> Plane (0, 0, 0, e0)
 * All components vanish except for e0 (assuming pseudo is 0), simplifying to:
 * (a.e1 * b.e01) + (a.e2 * b.e02) + (a.e3 * b.e03)
*/
export const innerIdealPlane = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/* === Origin line inner products ===
 *
 * Origin line ∙ Plane       -> Plane (e1, e2, e3, 0)
 * Origin line ∙ Ideal line  -> Vanishes completely (assuming pseudo is 0)
 * Origin line ∙ Origin line -> Scalar
 * Origin line ∙ Line        -> Scalar
 * Origin line ∙ Point       -> Plane (e1, e2, e3, e0)
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
 * Origin line ∙ Origin line -> Scalar
 * All components vanish except for s, simplifying to:
 * -((a.e23 * b.e23) + (a.e31 * b.e31) + (a.12 * b.e12))
*/
export const innerOriginOrigin = (a, b) => (
  -(a[0] * b[0] + a[1] * b[1] + a[2] * b[2])
);

/*
 * Origin line ∙ Line -> Scalar
 * All components vanish except for s, simplifying to:
 * -((a.e23 * b.e23) + (a.e31 * b.e31) + (a.12 * b.e12))
*/
export const innerOriginLine = (a, b) => (
  -(a[0] * b[4] + a[1] * b[5] + a[2] * b[6]) // Offset by 4 for indices 4-7
);

/*
 * Origin line ∙ Point -> Plane (e1, e2, e3, e0)
 * Commutative with Point ∙ Line
 *
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

/* === Line inner products ===
 *
 * Line ∙ Plane       -> Plane(e1, e2, e3, e0)
 * Line ∙ Ideal line  -> Vanishes completely
 * Line ∙ Origin line -> Scalar
 * Line ∙ Line        -> Scalar
 * Line ∙ Point       -> Plane(e1, e2, e3, e0)
*/

/*
 * Line ∙ Plane -> Plane(e1, e2, e3, e0)
 * Components are the plane that is orthogonal to the line and
 * intersecting the plane, simplifying to:
 * (a.e12 * b.e2 - a.e31 * b.e3) -> e1
 * (a.e23 * b.e3 - a.e12 * b.e1) -> e2
 * (a.e31 * b.e1 - a.e23 * b.e2) -> e3
 * (a.e23 * b.e1) + (a.e31 * b.e2) + (a.e12 * b.e3) -> e0
*/
export const innerLinePlane = (a, b) => {
  const e1 = a[6] * b[1] - a[5] * b[2]; // Offset a by 4 due to origin being
  const e2 = a[4] * b[2] - a[6] * b[0]; // indices 4-7
  const e3 = a[5] * b[0] - a[4] * b[1];
  const e0 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e1, e2, e3, e0]);
};

/*
 * Line ∙ Origin line -> Scalar
 * All components vanish except for s, simplifying to:
 * -((a.e23 * b.e23) + (a.e31 * b.e31) + (a.12 * b.e12))
*/
export const innerLineOrigin = (a, b) => (
  -(a[4] * b[0] + a[5] * b[1] + a[6] * b[2]) // Offset by 4 for indices 4-7
);

/*
 * Line ∙ Line -> Scalar
 * All components vanish except for s, simplifying to:
 * -((a.e23 * b.e23) + (a.e31 * b.e31) + (a.12 * b.e12))
*/
export const innerLineLine = (a, b) => (
  -(a[4] * b[4] + a[5] * b[5] + a[6] * b[6]) // Offset by 4 for indices 4-7
);

/*
 * Line ∙ Point -> Plane (e1, e2, e3, e0)
 * Commutative with Point ∙ Line
 *
 * Components are the plane that is orthogonal to the line and
 * intersecting the point, simplifying to:
 * -((a.e23 * b.e123)) -> e1
 * -((a.e31 * b.e123)) -> e2
 * -((a.e12 * b.e123)) -> e3
 * (a.e23 * b.e032) + (a.e31 * b.e013) + (a.e12 * b.e021) -> e0
*/
export const innerLinePoint = (a, b) => {
  const e1 = -(a[4] * b[3]);
  const e2 = -(a[5] * b[3]);
  const e3 = -(a[6] * b[3]);
  const e0 = a[4] * b[0] + a[5] * b[1] + a[6] * b[2];

  return new Float32Array([e1, e2, e3, e0]);
};

/* === Point inner products ===
 *
 * Point ∙ Plane       -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
 * Point ∙ Ideal line  -> Vanishes completely
 * Point ∙ Origin line -> Plane(e1, e2, e3, e0)
 * Point ∙ Line        -> Plane(e1, e2, e3, e0)
 * Point ∙ Point       -> Scalar
*/

/*
 * Point ∙ Plane -> Ideal line (e01, e02, e03, 0)
 * Components are the intersections with the ideal plane, simplifying to:
 * (a.e013 * b.e3 - a.e021 * b.e2) -> e01
 * (a.e021 * b.e1 - a.e032 * b.e3) -> e02
 * (a.e032 * b.e2 - a.e013 * b.e1) -> e03
*/
export const innerPointPlaneI = (a, b) => {
  const e01 = a[1] * b[2] - a[2] * b[1];
  const e02 = a[2] * b[0] - a[0] * b[2];
  const e03 = a[0] * b[1] - a[1] * b[0];

  return new Float32Array([e01, e02, e03, 0]);
};

/*
 * Point ∙ Plane -> Origin line (e23, e31, e12, 0)
 * Components are the pure Euclidean description of direction, simplifying to:
 * (a.e123 * b.e1) -> e23
 * (a.e123 * b.e2) -> e31
 * (a.e123 * b.e3) -> e12
*/
export const innerPointPlaneO = (a, b) => {
  const e23 = a[3] * b[0];
  const e31 = a[3] * b[1];
  const e12 = a[3] * b[2];

  return new Float32Array([e23, e31, e12, 0]);
};

/*
 * Point ∙ Plane -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
 * Combination of the above, full point-plane inner product
*/
export const innerPointPlane = (a, b) => {
  const e01 = a[1] * b[2] - a[2] * b[1];
  const e02 = a[2] * b[0] - a[0] * b[2];
  const e03 = a[0] * b[1] - a[1] * b[0];

  const e23 = a[3] * b[0];
  const e31 = a[3] * b[1];
  const e12 = a[3] * b[2];

  return new Float32Array([e01, e02, e03, 0, e23, e31, e12, 0]);
};

/*
 * Point ∙ Origin line -> Plane (e1, e2, e3, e0)
 * Commutative with Line ∙ Point
 *
 * Components are the plane that is orthogonal to the line and
 * intersecting the point, simplifying to:
 * -((a.e123 * b.e23)) -> e1
 * -((a.e123 * b.e31)) -> e2
 * -((a.e123 * b.e12)) -> e3
 * (a.e032 * b.e23) + (a.e013 * b.e31) + (a.e021 * b.e12) -> e0
*/
export const innerPointOrigin = (a, b) => {
  const e1 = -(a[3] * b[0]);
  const e2 = -(a[3] * b[1]);
  const e3 = -(a[3] * b[2]);
  const e0 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e1, e2, e3, e0]);
};

/*
 * Point ∙ Origin line -> Plane (e1, e2, e3, e0)
 * Commutative with Line ∙ Point
 *
 * Components are the plane that is orthogonal to the line and
 * intersecting the point, simplifying to:
 * -((a.e123 * b.e23)) -> e1
 * -((a.e123 * b.e31)) -> e2
 * -((a.e123 * b.e12)) -> e3
 * (a.e032 * b.e23) + (a.e013 * b.e31) + (a.e021 * b.e12) -> e0
*/
export const innerPointLine = (a, b) => {
  const e1 = -(a[3] * b[4]);
  const e2 = -(a[3] * b[5]);
  const e3 = -(a[3] * b[6]);
  const e0 = a[0] * b[4] + a[1] * b[5] + a[2] * b[6];

  return new Float32Array([e1, e2, e3, e0]);
};

/*
 * Point ∙ Point -> Scalar
 * All components vanish except e123, simplifying to:
 * -(a.e123 * b.e123)
*/
export const innerPointPoint = (a, b) => (
  -(a[3] * b[3])
);
