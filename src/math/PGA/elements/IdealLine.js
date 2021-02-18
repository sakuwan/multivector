import {
  PGATypes,
  formatPGAType,
} from '../impl/types';

import createPGAElement from './PGAElement';

/* === Ideal Line (e01, e02, e03, e0123) ===
 *
 * One of the bivector elements of PGA, the ideal line represents the lines
 * at infinity, or the degenerate lines. Throughout this implementation and
 * others, e0123 will be assumed to be 0.
 *
 * The IdealElement class represents an ideal line, and its provided methods
 * are unary, and focused on the element itself, rather than the vector space
 *
 * === Component access ===
 *
 * get / set e01:   k-vector component access (0 / x)
 * get / set e02:   k-vector component access (1 / y)
 * get / set e03:   k-vector component access (2 / z)
 * get / set e0123: k-vector component access (3 / w)
 *
 * === Norm / Normalization ===
 *
 * Ideal line k-vectors: [e01, e02, e03, e0123]
 * Ideal line metric: [0, 0, 0, 0]
 *
 * norm: e0 squares to 0, all components vanish
 * infinity norm: ||l∞||∞ = ||lο||
 *
 * normalize: assuming l∞ / ||l∞||∞, l∞∙l∞ = -1
 * invert: assuming l∞ / ||l∞||∞, l∞∙l∞⁻¹ = 1
 *
 * === Antiautomorphisms ===
 *
 * involute:  [e01, e02, e03, e0123] = [e01, e02, e03, e0123]
 * reverse:   [e01, e02, e03, e0123] = [-e01, -e02, -e03, e0123]
 * conjugate: [e01, e02, e03, e0123] = [-e01, -e02, -e03, e0123]
 * negate:    [e01, e02, e03, e0123] = [-e01, -e02, -e03, -e0123]
*/
export class IdealElement {
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.IdealLine;
  }

  /* eslint-disable class-methods-use-this, lines-between-class-members */
  length() { return 0; }
  lengthSq() { return 0; }
  /* eslint-enable */

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
    const invNorm = (1.0 / (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3])) ** 0.5;

    v[0] *= invNorm;
    v[1] *= invNorm;
    v[2] *= invNorm;
    v[3] *= invNorm;

    return this;
  }

  invert() {
    const { buffer: v } = this;
    const invNorm = (1.0 / (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]));

    v[0] *= -invNorm;
    v[1] *= -invNorm;
    v[2] *= -invNorm;
    v[3] *= invNorm;

    return this;
  }
}

createPGAElement(IdealElement, {
  basis: ['e01', 'e02', 'e03', 'e0123'],
  name: formatPGAType(PGATypes.IdealLine),
});

/* === IdealLine factory ===
 *
 * (a, b, c, d) -> IdealLine((a * e01), (b * e02), (c * e03), (d * e0123))
*/
export const IdealLine = (a = 0, b = 0, c = 0, d = 0) => (
  new IdealElement(new Float32Array([a, b, c, d]))
);
