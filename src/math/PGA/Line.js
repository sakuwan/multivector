import {
  PGATypes,
  formatPGAType,
} from './impl/types';

import createPGAElement from './PGAElement';

/* === Line (e01, e02, e03, e0123, e23, e31, e12, s) ===
 *
 * The combination element and representation of general lines is a 6-bivector
 * coordinate multivector, lines are Plücker coordinates that happen to arise
 * naturally in PGA. Both e0123 and s are assumed to be 0 throughout.
 *
 * The LineElement class represents a line, and its provided methods
 * are unary, and focused on the element itself, rather than the vector space
 *
 * === Component access ===
 *
 * get / set e01:   k-vector component access (0 / px)
 * get / set e02:   k-vector component access (1 / py)
 * get / set e03:   k-vector component access (2 / pz)
 * get / set e0123: k-vector component access (3 / I)
 *
 * get / set e23:   k-vector component access (4 / dx)
 * get / set e31:   k-vector component access (5 / dy)
 * get / set e12:   k-vector component access (6 / dz)
 * get / set s:     k-vector component access (7 / s)
 *
 * === Norm operations ===
 *
 * length, lengthSq
 * infinityLength, infinityLengthSq (Vanishes completely to 0)
 * euclideanLength, euclideanLengthSq
 *
 * normalize: Normalization satisfies ℓ∙ℓ = -1
 * invert: Inversion satisfies ℓ∙ℓ⁻¹ = 1
 *
 * === Antiautomorphisms ===
 *
 * involute:  [e01, e02, e03, e0123, e23, e31, e12, s]
 *          = [e01, e02, e03, e0123, e23, e31, e12, s]
 *
 * reverse:   [e01, e02, e03, e0123, e23, e31, e12, s]
 *          = [-e01, -e02, -e03, e0123, -e23, -e31, -e12, s]
 *
 * conjugate: [e01, e02, e03, e0123, e23, e31, e12, s]
 *          = [-e01, -e02, -e03, e0123, -e23, -e31, -e12, s]
 *
 * negate:    [e01, e02, e03, e0123, e23, e31, e12, s]
 *          = [-e01, -e02, -e03, -e0123, -e23, -e31, -e12, -s]
*/
export class LineElement {
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Line;
  }
}

createPGAElement(LineElement, {
  basis: ['e01', 'e02', 'e03', 'e0123', 'e23', 'e31', 'e12', 's'],
  name: formatPGAType(PGATypes.Line),
});

/* === Line factory ===
 *
 * (a, b, c, 0, d, f, g, 0) -> Line(
 *   (a * e01), (b * e02), (c * e03), (0 * e0123)),
 *   (d * e23), (f * e31), (g * e12), (0 * s)),
 * )
*/
export const Line = (a = 0, b = 0, c = 0, d = 0, f = 0, g = 0) => (
  new LineElement(new Float32Array([a, b, c, 0, d, f, g, 0]))
);
