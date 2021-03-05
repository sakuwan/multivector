/* === PGA (3, 0, 1) Square roots ===
 *
 * Due to the nature of sandwich products and the non-linear nature of
 * translations, rotations, and screws, it is necessary to find the square
 * roots of such elements before their application
*/

/*
 * sqrt(Motor) -> Motor (e01, e02, e03, e0123, e23, e31, e12, s)
 *
 * The concept is based on the square root of dual numbers,
 * where sqrt(s + pI) = sqrt(s) + (p / 2 sqrt(s))I
 * ||Θ|| = u + vI = sqrt(-(Θ∙Θ + Θ∧Θ))
 *
 * Applies to lines as well:
 * sqrt(Line) -> Motor (e01, e02, e03, e0123, e23, e31, e12, s)
*/
export const sqrtMotor = (a) => {
  const sPlusOne = a[7] + 1;

  const ab = (a[4] * a[0] + a[5] * a[1] + a[6] * a[2] - sPlusOne * a[3]);
  const aa = (a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + sPlusOne * sPlusOne);

  const invRcp = (1.0 / aa);
  const invScalar = invRcp ** 0.5;
  const invPseudo = ab * invRcp * invScalar;

  // Translator
  const e01 = a[0] * invScalar - a[4] * invPseudo;
  const e02 = a[1] * invScalar - a[5] * invPseudo;
  const e03 = a[2] * invScalar - a[6] * invPseudo;
  const e0123 = a[3] * invScalar + sPlusOne * invPseudo;

  // Rotor
  const e23 = a[4] * invScalar;
  const e31 = a[5] * invScalar;
  const e12 = a[6] * invScalar;
  const s = sPlusOne * invScalar;

  return new Float32Array([e01, e02, e03, e0123, e23, e31, e12, s]);
};

/*
 * sqrt(Rotor) -> Rotor (e23, e31, e12, s)
 *
 * Applies to origin lines as well:
 * sqrt(Origin) -> Rotor (e23, e31, e12, s)
*/
export const sqrtRotor = (a) => {
  const sPlusOne = a[3] + 1;

  const norm = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + sPlusOne * sPlusOne);
  const invNorm = (1.0 / norm) ** 0.5;

  const e23 = a[0] * invNorm;
  const e31 = a[1] * invNorm;
  const e12 = a[2] * invNorm;
  const s = sPlusOne * invNorm;

  return new Float32Array([e23, e31, e12, s]);
};

/*
 * sqrt(Translator) -> Translator (e01, e02, e03, 0)
 *
 * Applies to ideal lines as well:
 * sqrt(Ideal) -> Translator (e01, e02, e03, 0)
*/
export const sqrtTranslator = (a) => {
  const e01 = a[0] * 0.5;
  const e02 = a[1] * 0.5;
  const e03 = a[2] * 0.5;

  return new Float32Array([e01, e02, e03, 0]);
};
