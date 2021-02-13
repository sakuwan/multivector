import {
  PGATypes,
  formatPGAType,
} from './impl/types';

import createPGAElement from './PGAElement';

/* === Point (e032, e013, e021, e123) ===
 *
 * The trivector element of PGA, points are represented as a result of the
 * intersection of three planes, and has components of grade 3.
 *
 * The PointElement class represents a point, and its provided methods are
 * unary, and focused on the element itself, rather than the vector space
 *
 * === Component access ===
 *
 * get / set e032: k-vector component access (0 / x)
 * get / set e013: k-vector component access (1 / y)
 * get / set e021: k-vector component access (2 / z)
 * get / set e123: k-vector component access (3 / w)
 *
 * === Norm operations ===
 *
 * length, lengthSq
 * infinityLength, infinityLengthSq
 * euclideanLength, euclideanLengthSq
 *
 * normalize: Normalization satisfies P∙P = 1
 * invert: Inversion satisfies P∙P⁻¹ = 1
 *
 * === Antiautomorphisms ===
 *
 * involute:  [e032, e013, e021, e123] = [-e032, -e013, -e021, -e123]
 * reverse:   [e032, e013, e021, e123] = [-e032, -e013, -e021, -e123]
 * conjugate: [e032, e013, e021, e123] = [e032, e013, e021, e123]
 * negate:    [e032, e013, e021, e123] = [-e032, -e013, -e021, -e123]
*/
export class PointElement {
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Point;
  }
}

const POINT_BASIS = ['e032', 'e013', 'e021', 'e123'];
createPGAElement(PointElement, formatPGAType(PGATypes.Point), POINT_BASIS);

/* === Point factory ===
 *
 * (x, y, z, w) -> Point((x * e032), (y * e013), (z * e021), (w * e123))
*/
export const Point = (x = 0, y = 0, z = 0, w = 1) => (
  new PointElement(new Float32Array([x, y, z, w]))
);
