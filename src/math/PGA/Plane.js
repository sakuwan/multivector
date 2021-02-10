import PGATypes from './types';
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
 * === Norm operations ===
 *
 * euclideanLength, euclideanLengthSq
 * length, lengthSq
 * infinityLength, infinityLengthSq
 *
 * normalize: Normalization satisfies p∙p = 1
 * invert: Inversion satisfies p∙p⁻¹ = 1
 *
 * === Antiautomorphisms ===
 *
 * involute:  [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
 * reverse:   [e1, e2, e3, e0] = [e1, e2, e3, e0]
 * conjugate: [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
 * negate:    [e1, e2, e3, e0] = [-e1, -e2, -e3, -e0]
*/
export class PlaneElement {
  /* === Plane element construction ===
   *
   * Set buffer (Float32Array({ length: 4 })) and element type (Plane)
  */

  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Plane;
  }
}

const PLANE_NAME = 'Plane';
const PLANE_BASIS = ['e1', 'e2', 'e3', 'e0'];
createPGAElement(PlaneElement, PLANE_NAME, PLANE_BASIS);

/* === Plane factory ===
 *
 * Represents the usual formula: ax + by + cz + d
 * (a, b, c, d) -> Plane((a * e1), (b * e2), (c * e3), (d * e0))
*/
export const Plane = (a = 0, b = 0, c = 0, d = 0) => (
  new PlaneElement(new Float32Array([a, b, c, d]))
);
