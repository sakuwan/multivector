/* === PGA (3, 0, 1) Logarithm ===
 *
 * Due to the lack of commutativity and the non-linear nature of translations,
 * rotations, and screws, it is necessary to map between the logarithm and
 * exponential to achieve linear scaling.
*/

/* === Complex bivector logarithm ===
 *
 * log(Motor) -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
 *
 * Based on the following paper:
 * "Geometric Algebra for Computer Graphics" - Charles G. Gunn
 *
 * Following the derived exponentiation, we can work backwards to reduce
 * this overdetermined system to the normalized u and v values
 * if s ≈ 0:
 *
 * u = tan⁻¹(s⁻¹, s)
 * v = p⁻¹ / s
 *
 * otherwise:
 *
 * u = tan⁻¹(-p, p⁻¹)
 * v = -p / s⁻¹
*/
export const logMotor = (a) => {
  const ab = (a[4] * a[0] + a[5] * a[1] + a[6] * a[2]);
  const aa = (a[4] * a[4] + a[5] * a[5] + a[6] * a[6]);
  if (aa === 0) {
    const [e01, e02, e03, e0123] = a;

    return new Float32Array([e01, e02, e03, e0123, 0, 0, 0, 0]);
  }

  const invRcp = (1.0 / aa);
  const invSqrt = invRcp ** 0.5;

  const invScalar = aa * invSqrt;
  const invPseudo = -(ab * invSqrt);

  const closeToZero = Math.abs(a[7]) < 1e-6;
  const u = closeToZero ? Math.atan2(-a[3], invPseudo) : Math.atan2(invScalar, a[7]);
  const v = closeToZero ? -a[3] / invScalar : invPseudo / a[7];

  const e23n = a[4] * invSqrt;
  const e31n = a[5] * invSqrt;
  const e12n = a[6] * invSqrt;
  const infinityNorm = ab * invRcp * invSqrt;

  const e01 = (a[0] * invSqrt - a[4] * infinityNorm) * u - e23n * v;
  const e02 = (a[1] * invSqrt - a[5] * infinityNorm) * u - e31n * v;
  const e03 = (a[2] * invSqrt - a[6] * infinityNorm) * u - e12n * v;

  const e23 = e23n * u;
  const e31 = e31n * u;
  const e12 = e12n * u;

  return new Float32Array([e01, e02, e03, 0, e23, e31, e12, 0]);
};

/*
 * log(Rotor) -> Origin (e23, e31, e12, 0)
*/
export const logRotor = (a) => {
  const theta = Math.acos(a[3]);
  const invTheta = (1.0 / Math.sin(theta)) * theta;

  const e23 = a[0] * invTheta;
  const e31 = a[1] * invTheta;
  const e12 = a[2] * invTheta;

  return new Float32Array([e23, e31, e12, 0]);
};

/*
 * log(Translator) -> Ideal (e01, e02, e03, 0)
*/
export const logTranslator = (a) => {
  const [e01, e02, e03] = a;

  return new Float32Array([e01, e02, e03, 0]);
};
