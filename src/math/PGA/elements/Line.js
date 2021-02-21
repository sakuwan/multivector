import {
  PGATypes,
  formatPGAType,
} from '../impl/types';

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
 * === Norm / Normalization ===
 *
 * Line k-vectors: [e01, e02, e03, e0123, e23, e31, e12, s]
 * Line metric: [0, 0, 0, 0, -1, -1, -1, 1]
 *
 * norm: ℓ∙ℓ = -1 (||ℓ|| = ||lο||)
 * infinity norm: ||ℓ||∞ == ||l∞||∞
 *
 * normalize: ℓ∙ℓ = -1
 * invert: ℓ∙ℓ⁻¹ = 1
 *
 * === Complex Bivector normalization & inversion ===
 *
 * Based on the papers from SIGGRAPH 2019 by Charles G. Gunn
 * "Geometric Algebra for Computer Graphics"
 *
 * The concept is based on the square root of dual numbers,
 * where sqrt(s + pI) = sqrt(s) + (p / 2 sqrt(s))I
 * ||Θ|| = u + vI = sqrt(-(Θ∙Θ + Θ∧Θ))
 *
 * The process of decomposing complex bivectors into their components is
 * useful for normalization, inversion, and exponentiation, which is also
 * used in motors
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

  length() {
    const { buffer: v } = this;
    return (v[4] * v[4] + v[5] * v[5] + v[6] * v[6] + v[7] * v[7]) ** 0.5;
  }

  lengthSq() {
    const { buffer: v } = this;
    return (v[4] * v[4] + v[5] * v[5] + v[6] * v[6] + v[7] * v[7]);
  }

  infinityLength() {
    const { buffer: v } = this;
    return (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]) ** 0.5;
  }

  infinityLengthSq() {
    const { buffer: v } = this;
    return (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
  }

  normalize() {
    const { buffer: v } = this;

    const u2 = (v[4] * v[4] + v[5] * v[5] + v[6] * v[6]);
    const uv = (v[0] * v[4] + v[1] * v[5] + v[2] * v[6]);
    if (u2 === 0) { v.fill(0); return this; }

    const s = (1.0 / u2) ** 0.5;
    const p = (1.0 / u2) * uv * s;

    v[0] = v[0] * s - v[4] * p;
    v[1] = v[1] * s - v[5] * p;
    v[2] = v[2] * s - v[6] * p;
    v[3] = v[3] * s - v[7] * p;

    v[4] *= s;
    v[5] *= s;
    v[6] *= s;
    v[7] *= s;

    return this;
  }

  invert() {
    const { buffer: v } = this;

    const u2 = (v[4] * v[4] + v[5] * v[5] + v[6] * v[6]);
    const uv = (v[0] * v[4] + v[1] * v[5] + v[2] * v[6]);
    if (u2 === 0) { v.fill(0); return this; }

    const s = (1.0 / u2);
    const p = 2 * s * s * uv;

    v[0] = -(v[0] * s - v[4] * p);
    v[1] = -(v[1] * s - v[5] * p);
    v[2] = -(v[2] * s - v[6] * p);
    v[3] = v[3] * s - v[7] * p;

    v[4] *= -s;
    v[5] *= -s;
    v[6] *= -s;
    v[7] *= s;

    return this;
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
