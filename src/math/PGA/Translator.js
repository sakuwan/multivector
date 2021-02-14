import {
  PGATypes,
  formatPGAType,
} from './impl/types';

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
 * === Norm operations ===
 *
 * length, lengthSq (Vanishes completely to 0)
 * infinityLength, infinityLengthSq
 * euclideanLength, euclideanLengthSq
 *
 * normalize: Normalization satisfies -sqrt(||R||) = d/2
 * invert: Inversion satisfies -sqrt(||R||) = -d/2
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
}

createPGAElement(TranslatorElement, {
  basis: ['e01', 'e02', 'e03', 's'],
  name: formatPGAType(PGATypes.Translator),
});

/* === Translator factory ===
 *
 * (x, y, z, s) -> Translator((x * e01), (y * e02), (z * e03), (s * s))
*/
export const Translator = (x = 0, y = 0, z = 0, s = 0) => (
  new TranslatorElement(new Float32Array([x, y, z, s]))
);
