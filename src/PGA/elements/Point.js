import {
  PGATypes,
  formatPGAType,
} from '../types';

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
 * === Norm / Normalization ===
 *
 * Point k-vectors: [e032, e013, e021, e123]
 * Point metric: [0, 0, 0, -1]
 *
 * norm: e0 squares to zero, e123 remains
 * infinity norm: ||P||∞ = ||p||
 *
 * normalize: P∙P = 1
 * invert: P∙P⁻¹ = 1
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

  length() { return this.buffer[3]; }

  lengthSq() { return this.buffer[3] * this.buffer[3]; }

  infinityLength() {
    const { buffer: v } = this;
    return (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) ** 0.5;
  }

  infinityLengthSq() {
    const { buffer: v } = this;
    return (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }

  normalize() {
    const { buffer: v } = this;
    const invNorm = (1.0 / v[3]);

    v[0] *= invNorm;
    v[1] *= invNorm;
    v[2] *= invNorm;
    v[3] *= invNorm;

    return this;
  }

  invert() {
    const { buffer: v } = this;
    const invNorm = (1.0 / (v[3] * v[3]));

    v[0] *= invNorm;
    v[1] *= invNorm;
    v[2] *= invNorm;
    v[3] *= invNorm;

    return this;
  }
}

createPGAElement(PointElement, {
  basis: ['e032', 'e013', 'e021', 'e123'],
  name: formatPGAType(PGATypes.Point),
});

/* === Point factory ===
 *
 * (x, y, z, w) -> Point((x * e032), (y * e013), (z * e021), (w * e123))
*/
export const Point = (x = 0, y = 0, z = 0, w = 1) => (
  new PointElement(new Float32Array([x, y, z, w]))
);
