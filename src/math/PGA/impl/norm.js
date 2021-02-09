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
 *
 * normalize: p∙p = 1
 * invert: p∙p⁻¹ = 1
*/

export const planeNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5
);

export const planeNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2]
);

export const planeInfinityNorm = (a) => a[3];

export const planeInfinityNormSq = (a) => a[3] * a[3];

export const planeNormalize = (a) => { /* eslint-disable no-param-reassign */
  const invNorm = (1.0 / ((a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5));

  a[0] *= invNorm;
  a[1] *= invNorm;
  a[2] *= invNorm;

  /* === TODO: Ask Gunn, Keninck or Ong about this in regards to 3,0,1 PGA
   * I will admit, I honestly have no idea when it comes to e0 and normalization, as I see a blend
   * of approaches from multiple authors and papers. Some ignore it entirely, some normalize it
   * by the same value as the k-vectors, and others add scalars and then normalize. I will stand to
   * simply treat it the same as the other k-vectors here, similar to what Ganja and others do.
  */

  a[3] *= invNorm;
}; /* eslint-enable no-param-reassign */

export const planeInvert = (a) => { /* eslint-disable no-param-reassign */
  const invNorm = (1.0 / (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]));

  a[0] *= invNorm;
  a[1] *= invNorm;
  a[2] *= invNorm;
  a[3] *= invNorm;
}; /* eslint-enable no-param-reassign */

/* === Ideal line norm operations ===
 *
 * Ideal line k-vectors: [e01, e02, e03, e0123]
 * Ideal line metric: [0, 0, 0, 0]
 *
 * norm: e0 squares to zero and all components vanish
 * infinity norm: ||l∞||∞ = ||lο||
 *
 * normalize: assuming l∞ / ||l∞||∞, l∞∙l∞ = -1
 * invert: assuming l∞ / ||l∞||∞, l∞∙l∞⁻¹ = 1
*/

export const idealNorm = () => 0;

export const idealNormSq = () => 0;

export const idealInfinityNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) ** 0.5
);

export const idealInfinityNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]
);

export const idealNormalize = (a) => { /* eslint-disable no-param-reassign */
  const invNorm = (1.0 / ((a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) ** 0.5));

  a[0] *= invNorm;
  a[1] *= invNorm;
  a[2] *= invNorm;
  a[3] *= invNorm;
}; /* eslint-enable no-param-reassign */

export const idealInvert = (a) => { /* eslint-disable no-param-reassign */
  const invNorm = (1.0 / (a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]));

  a[0] *= -invNorm;
  a[1] *= -invNorm;
  a[2] *= -invNorm;
  a[3] *= invNorm;
}; /* eslint-enable no-param-reassign */

/* === Origin line norm operations ===
 *
 * Origin line k-vectors: [e23, e31, e12, s]
 * Origin line metric: [-1, -1, -1, 1]
 *
 * norm: No components vanish
 * infinity norm: ||lο||∞ = ||l∞||
 *
 * normalize: lο∙lο = -1
 * invert: lο∙lο⁻¹ = 1
*/

export const originNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) ** 0.5
);

export const originNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]
);

export const originInfinityNorm = () => 0;

export const originInfinityNormSq = () => 0;

export const originNormalize = (a) => { /* eslint-disable no-param-reassign */
  const invNorm = (1.0 / ((a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) ** 0.5));

  a[0] *= invNorm;
  a[1] *= invNorm;
  a[2] *= invNorm;
  a[3] *= invNorm;
}; /* eslint-enable no-param-reassign */

export const originInvert = (a) => { /* eslint-disable no-param-reassign */
  const invNorm = (1.0 / (a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]));

  a[0] *= -invNorm;
  a[1] *= -invNorm;
  a[2] *= -invNorm;
  a[3] *= invNorm;
}; /* eslint-enable no-param-reassign */

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
 *
 * normalize: P∙P = 1
 * invert: P∙P⁻¹ = 1
*/

export const pointNorm = (a) => a[3];

export const pointNormSq = (a) => a[3] * a[3];

export const pointInfinityNorm = (a) => (
  (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5
);

export const pointInfinityNormSq = (a) => (
  a[0] * a[0] + a[1] * a[1] + a[2] * a[2]
);

export const pointNormalize = (a) => { /* eslint-disable no-param-reassign */
  const invNorm = (1.0 / a[3]);

  a[0] *= invNorm;
  a[1] *= invNorm;
  a[2] *= invNorm;
  a[3] *= invNorm;
}; /* eslint-enable no-param-reassign */

export const pointInvert = (a) => { /* eslint-disable no-param-reassign */
  const invNorm = (1.0 / (a[3] * a[3]));

  a[0] *= invNorm;
  a[1] *= invNorm;
  a[2] *= invNorm;
  a[3] *= invNorm;
}; /* eslint-enable no-param-reassign */
