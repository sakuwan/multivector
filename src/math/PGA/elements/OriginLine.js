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
 * === Norm operations ===
 *
 * length, lengthSq
 * euclideanLength, euclideanLengthSq
 *
 * normalize: Normalization satisfies lο∙lο = -1
 * invert: Inversion satisfies lο∙lο⁻¹ = 1
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
