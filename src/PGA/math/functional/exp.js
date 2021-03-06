/* === PGA (3, 0, 1) Exponentiation ===
 *
 * Due to the lack of commutativity and the non-linear nature of translations,
 * rotations, and screws, it is necessary to map between the logarithm and
 * exponential to achieve linear scaling
*/

/*
 * exp(Ideal) -> Translator (e01, e02, e03, 0)
*/
export const expIdeal = (a) => {
  const [e01, e02, e03] = a;

  return new Float32Array([e01, e02, e03, 0]);
};

/*
 * exp(Origin) -> Rotor (e23, e31, e12, s)
*/
export const expOrigin = (a) => {
  const theta = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) ** 0.5;
  if (theta === 0) return new Float32Array([0, 0, 0, Math.cos(theta)]);

  const sinTheta = Math.sin(theta) / theta;

  const e23 = a[0] * sinTheta;
  const e31 = a[1] * sinTheta;
  const e12 = a[2] * sinTheta;
  const s = a[3] * sinTheta + Math.cos(theta);

  return new Float32Array([e23, e31, e12, s]);
};

/* === Complex bivector exponentiation ===
 *
 * exp(Line) -> Motor (e01, e02, e03, e0123, e23, e31, e12, s)
 *
 * Based on the following papers and projects:
 * "Geometric Algebra for Computer Graphics" - Charles G. Gunn
 * "A Guided Tour to the Plane-Based Geometric Algebra PGA" - Leo Dorst
 * Klein (for proofing & for their wonderful documentation) - Jeremy Ong
 *
 * The concept is based on the square root of dual numbers,
 * where sqrt(s + pI) = sqrt(s) + (p / 2 sqrt(s))I
 * ||Θ|| = u + vI = sqrt(-(Θ∙Θ + Θ∧Θ))
 *
 * Expanded for exponentiation with n being the normalized bivector,
 * e^(u + vI)n = e^(un) e^(vnI) =
 * (cos u + sin u n) + vn cos u - v sin u
*/
export const expLine = (a) => {
  const ab = (a[4] * a[0] + a[5] * a[1] + a[6] * a[2]);
  const aa = (a[4] * a[4] + a[5] * a[5] + a[6] * a[6]);
  if (aa === 0) return new Float32Array(8);

  const invRcp = (1.0 / aa);
  const invSqrt = invRcp ** 0.5;

  const u = aa * invSqrt;
  const v = ab * invSqrt;

  const cosu = Math.cos(u);
  const sinu = Math.sin(u);

  const e23n = a[4] * invSqrt;
  const e31n = a[5] * invSqrt;
  const e12n = a[6] * invSqrt;
  const infinityNorm = v * invRcp;

  const e01 = (a[0] * invSqrt - a[4] * infinityNorm) * sinu + e23n * v * cosu;
  const e02 = (a[1] * invSqrt - a[5] * infinityNorm) * sinu + e31n * v * cosu;
  const e03 = (a[2] * invSqrt - a[6] * infinityNorm) * sinu + e12n * v * cosu;
  const e0123 = (a[3] * invSqrt - a[7] * infinityNorm) * sinu + v * sinu;

  const e23 = e23n * sinu;
  const e31 = e31n * sinu;
  const e12 = e12n * sinu;
  const s = a[7] * invSqrt * sinu + cosu;

  return new Float32Array([e01, e02, e03, e0123, e23, e31, e12, s]);
};
