/* === PGA (3, 0, 1) norm operations ===
 *
 * Norm-related operations range from length functions in the normed vector
 * space, and to normalization / inversion, due to their reliance on the norm
*/

/* === Shared norm operations ===
 *
 * The standard L2 norm, Euclidean length
*/

export const euclideanNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) ** 0.5
);

export const euclideanNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]
);

/* === Plane norm operations ===
 *
 * Plane k-vectors: [e1, e2, e3, e0]
 * Plane metric: [1, 1, 1, 0]
 *
 * norm: e0 squares to zero and vanishes
 * infinity norm: ||p||∞ = ||P||
*/

export const planeNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5
);

export const planeNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2]
);

export const planeInfinityNorm = (a) => (a[3] * a[3]) ** 0.5;

export const planeInfinityNormSq = (a) => a[3] * a[3];

/* === Ideal line norm operations ===
 *
 * Ideal line k-vectors: [e01, e02, e03, e0123]
 * Ideal line metric: [0, 0, 0, 0]
 *
 * norm: e0 squares to zero and all components vanish
 * infinity norm: ||l∞||∞ = ||lο||
*/

export const idealNorm = () => 0;

export const idealNormSq = () => 0;

export const idealInfinityNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) ** 0.5
);

export const idealInfinityNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]
);

/* === Origin line norm operations ===
 *
 * Origin line k-vectors: [e23, e31, e12, s]
 * Origin line metric: [-1, -1, -1, 1]
 *
 * norm: No components vanish
 * infinity norm: ||lο||∞ = ||l∞||
*/

export const originNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) ** 0.5
);

export const originNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]
);

export const originInfinityNorm = () => 0;

export const originInfinityNormSq = () => 0;

/* === Line norm operations ===
 *
 * Line k-vectors: [e01, e02, e03, e0123, e23, e31, e12, s]
 * Line metric: [0, 0, 0, 0, -1, -1, -1, 1]
 *
 * norm: Ideal line vanishes, origin line contributes
 * infinity norm: ||ℓ||∞ == ||l∞||∞
*/

export const lineNorm = (a) => (
  (a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + a[7] * a[7]) ** 0.5
);

export const lineNormSq = (a) => (
  a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + a[7] * a[7]
);

export const lineInfinityNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) ** 0.5
);

export const lineInfinityNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]
);

/* === Point norm operations ===
 *
 * Point k-vectors: [e032, e013, e021, e123]
 * Point metric: [0, 0, 0, -1]
 *
 * norm: e0 squares to zero, e123 remains
 * infinity norm: ||P||∞ = ||p||
*/

export const pointNorm = (a) => (a[3] * a[3]) ** 0.5;

export const pointNormSq = (a) => a[3] * a[3];

export const pointInfinityNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5
);

export const pointInfinityNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2]
);
