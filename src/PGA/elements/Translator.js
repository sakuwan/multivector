import {
  PGATypes,
  formatPGAType,
} from '../types';

import createPGAElement from './PGAElement';

/* === Translator (e01, e02, e03, s) ===
 *
 * A translator represents kinetic motion along a normalized axis, the ideal
 * portion of a motor. A translator must be normalized, and in the majority of
 * cases, the pseudoscalar should be exactly 0
 *
 * The TranslatorElement class represents a translator, and its provided
 * methods are unary, and focused on the element itself, rather than the
 * vector space
 *
 * === Component access ===
 *
 * get / set e01:   k-vector component access (0 / x)
 * get / set e02:   k-vector component access (1 / y)
 * get / set e03:   k-vector component access (2 / z)
 * get / set s: k-vector component access (3 / w)
 *
 * === Norm / Normalization ===
 *
 * Translator k-vectors: [e01, e02, e03, e0123]
 * Translator metric: [0, 0, 0, 0]
 *
 * norm: e0 squares to zero and all components vanish
 * infinity norm: ||T∞||∞ = ||R||
 *
 * normalize: -sqrt(||R||) = d/2
 * invert: -sqrt(||R||) = -d/2
 *
 * === Antiautomorphisms ===
 *
 * involute:  [e01, e02, e03, s] = [e01, e02, e03, s]
 * reverse:   [e01, e02, e03, s] = [-e01, -e02, -e03, s]
 * conjugate: [e01, e02, e03, s] = [-e01, -e02, -e03, s]
 * negate:    [e01, e02, e03, s] = [-e01, -e02, -e03, -s]
*/
export class TranslatorElement {
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Translator;
  }

  from(x, y, z, s = 1) {
    const { buffer: v } = this;
    const distance = -0.5 * s * (1.0 / (x * x + y * y + z * z)) ** 0.5;

    v[0] = x * distance;
    v[1] = y * distance;
    v[2] = z * distance;
    v[3] = 0;

    return this;
  }

  /* eslint-disable class-methods-use-this, lines-between-class-members */
  length() { return 0; }
  lengthSq() { return 0; }
  /* eslint-enable class-methods-use-this, lines-between-class-members */

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

    const invNorm = (1.0 / (v[0] * v[0] + v[1] * v[1] + v[2] * v[2])) ** 0.5;
    const distance = -0.5 * v[3] * invNorm;

    v[0] *= distance;
    v[1] *= distance;
    v[2] *= distance;
    v[3] = 0;

    return this;
  }

  invert() {
    const { buffer: v } = this;

    const invNorm = (1.0 / (v[0] * v[0] + v[1] * v[1] + v[2] * v[2])) ** 0.5;
    const distance = 0.5 * v[3] * invNorm;

    v[0] *= distance;
    v[1] *= distance;
    v[2] *= distance;
    v[3] = 0;

    return this;
  }
}

createPGAElement(TranslatorElement, {
  basis: ['e01', 'e02', 'e03', 's'],
  name: formatPGAType(PGATypes.Translator),
});

/* === Translator factory ===
 *
 * (x, y, z, s) -> Translator((x * e01), (y * e02), (z * e03), (s * s))
 * Construct a normalized translator along the provided axis, scaled by s
*/
export const Translator = (x = 0, y = 0, z = 0, s = 1) => {
  const d = -0.5 * s * (1.0 / (x * x + y * y + z * z)) ** 0.5;
  return new TranslatorElement(new Float32Array([x * d, y * d, z * d, 0]));
};
