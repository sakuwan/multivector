import {
  PGATypes,
  formatPGAType,
} from '../types';

import createPGAElement from './PGAElement';

/* === Plane (e1, e2, e3, e0) ===
 *
 * The fundamental element in PGA, all elements are constructed from planes,
 * and the plane itself is a simple k-vector, as its components are grade 1.
 *
 * The PlaneElement class represents a plane, and its provided methods are
 * unary, and focused on the element itself, rather than the vector space
 *
 * === Component access ===
 *
 * get / set e1: k-vector component access (0 / x)
 * get / set e2: k-vector component access (1 / y)
 * get / set e3: k-vector component access (2 / z)
 * get / set e0: k-vector component access (3 / w)
 *
 * === Norm / Normalization ===
 *
 * Plane k-vectors: [e1, e2, e3, e0]
 * Plane metric: [1, 1, 1, 0]
 *
 * norm: e0 squares to zero and vanishes
 * infinity norm: ||p||∞ = ||P||
 *
 * normalize: p∙p = 1
 * invert: p∙p⁻¹ = 1
 *
 * === Antiautomorphisms ===
 *
 * involute:  [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
 * reverse:   [e1, e2, e3, e0] = [e1, e2, e3, e0]
 * conjugate: [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
 * negate:    [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
*/
export class PlaneElement {
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Plane;
  }

  length() {
    const { buffer: v } = this;
    return (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) ** 0.5;
  }

  lengthSq() {
    const { buffer: v } = this;
    return (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }

  infinityLength() { return this.buffer[3]; }

  infinityLengthSq() { return this.buffer[3] * this.buffer[3]; }

  normalize() {
    const { buffer: v } = this;

    const norm = (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (norm === 0) { v.fill(0); return this; }

    const invNorm = (1.0 / norm) ** 0.5;

    v[0] *= invNorm;
    v[1] *= invNorm;
    v[2] *= invNorm;

    /* === TODO: Ask Gunn, Keninck or Ong about this in regards to 3,0,1 PGA
    * I will admit, I honestly have no idea when it comes to e0 and
    * normalization, as I see a blend of approaches from multiple authors and
    * papers. Some ignore it entirely, some normalize it by the same value as
    * the k-vectors, and others add scalars and then normalize. I will stand
    * to simply treat it the same as the other k-vectors here, similar to what
    * ganja and others do
    */

    v[3] *= invNorm;

    return this;
  }

  invert() {
    const { buffer: v } = this;

    const norm = (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (norm === 0) { v.fill(0); return this; }

    const invNorm = (1.0 / norm);

    v[0] *= invNorm;
    v[1] *= invNorm;
    v[2] *= invNorm;
    v[3] *= invNorm;

    return this;
  }
}

createPGAElement(PlaneElement, {
  basis: ['e1', 'e2', 'e3', 'e0'],
  name: formatPGAType(PGATypes.Plane),
});

/* === Plane factory ===
 *
 * Represents the usual formula: ax + by + cz + d
 * (a, b, c, d) -> Plane((a * e1), (b * e2), (c * e3), (d * e0))
*/
export const Plane = (a = 0, b = 0, c = 0, d = 0) => (
  new PlaneElement(new Float32Array([a, b, c, d]))
);
