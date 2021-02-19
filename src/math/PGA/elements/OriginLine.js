import {
  PGATypes,
  formatPGAType,
} from '../impl/types';

import createPGAElement from './PGAElement';

/* === Origin Line (e23, e31, e12, s) ===
 *
 * One of the bivector elements of PGA, the origin line represents the lines
 * through the origin, and are non-degenerate. Throughout this implementation
 * and others, s will be assumed to be 0.
 *
 * The OriginElement class represents an origin line, and its provided methods
 * are unary, and focused on the element itself, rather than the vector space
 *
 * === Component access ===
 *
 * get / set e23: k-vector component access (0 / x)
 * get / set e31: k-vector component access (1 / y)
 * get / set e12: k-vector component access (2 / z)
 * get / set s:   k-vector component access (3 / w)
 *
 * === Norm / Normalization ===
 *
 * Origin line k-vectors: [e23, e31, e12, s]
 * Origin line metric: [-1, -1, -1, 1]
 *
 * norm: No components vanish
 * infinity norm: ||lο||∞ = ||l∞|| (All components vanish)
 *
 * normalize: lο∙lο = -1
 * invert: lο∙lο⁻¹ = 1
 *
 * === Antiautomorphisms ===
 *
 * involute:  [e23, e31, e12, s] = [e23, e31, e12, s]
 * reverse:   [e23, e31, e12, s] = [-e23, -e31, -e12, s]
 * conjugate: [e23, e31, e12, s] = [-e23, -e31, -e12, s]
 * negate:    [e23, e31, e12, s] = [-e23, -e31, -e12, -s]
*/
export class OriginElement {
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.OriginLine;
  }

  length() {
    const { buffer: v } = this;
    return (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]) ** 0.5;
  }

  lengthSq() {
    const { buffer: v } = this;
    return (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
  }

  /* eslint-disable class-methods-use-this, lines-between-class-members */
  infinityLength() { return 0; }
  infinityLengthSq() { return 0; }
  /* eslint-enable class-methods-use-this, lines-between-class-members */

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

createPGAElement(OriginElement, {
  basis: ['e23', 'e31', 'e12', 's'],
  name: formatPGAType(PGATypes.OriginLine),
});

/* === OriginLine factory ===
 *
 * (a, b, c, d) -> OriginLine((a * e23), (b * e31), (c * e12), (d * s))
*/
export const OriginLine = (a = 0, b = 0, c = 0, d = 0) => (
  new OriginElement(new Float32Array([a, b, c, d]))
);
