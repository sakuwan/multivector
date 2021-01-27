/*
 * PGA (3, 0, 1) metric operations
*/

/* === Shared metric operations === */

/*
 * The standard L2 norm, Euclidean length
*/

export const euclideanNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) ** 0.5
);

export const euclideanNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]
);

/* === Plane metric operations === */

/*
 * Plane k-vectors: [e1, e2, e3, e0]
 * Plane metric: [1, 1, 1, 0]
 *
 * e0 squares to zero and is ignored in the calculation
*/

export const planeNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5
);

export const planeNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2]
);

/* === Ideal metric operations === */

/*
 * Ideal k-vectors: [e01, e02, e03, e0123]
 * Ideal metric: [0, 0, 0, 0]
 *
 * e0 squares to zero, so all components vanish
 * The norm at infinity of ||a||∞ = ||*a||, where *a is the Hodge dual
*/

export const idealNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5
);

export const idealNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2]
);

/* === Origin metric operations === */

/*
 * Origin k-vectors: [e23, e31, e12, s]
 * Origin metric: [-1, -1, -1, 1]
 *
 * Through reversion, the scalar does not contribute
*/

export const originNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5
);

export const originNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2]
);

/* === Line metric operations === */

/*
 * Line k-vectors: [e01, e02, e03, e0123, e23, e31, e12, s]
 * Line metric: [0, 0, 0, 0, -1, -1, -1, 1]
 *
 * The norm of the line element is simply considered as the norm of the origin
*/

export const lineNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5
);

export const lineNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2]
);

/* === Point metric operations === */

/*
 * Point k-vectors: [e032, e013, e021, e123]
 * Point metric: [0, 0, 0, -1]
 *
 * e0 squares to zero, so the contributing component is simply e123
*/

export const pointNorm = (a) => (a[3] * a[3]) ** 0.5;

export const pointNormSq = (a) => a[3] * a[3];
