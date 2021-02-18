import {
  PGATypes,
  formatPGAType,
} from '../impl/types';

import createPGAElement from './PGAElement';

/* === Rotor (e23, e31, e12, s) ===
 *
 * A rotor represents rotational motion along a normalized axis, the
 * euclidean portion of a motor
 *
 * The RotorElement class represents a rotor, and its provided methods
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
 * normalize: Normalization satisfies R * ∼R = 1
 * invert: Inversion satisfies R * R⁻¹ = 1
 *
 * === Antiautomorphisms ===
 *
 * involute:  [e23, e31, e12, s] = [e23, e31, e12, s]
 * reverse:   [e23, e31, e12, s] = [-e23, -e31, -e12, s]
 * conjugate: [e23, e31, e12, s] = [-e23, -e31, -e12, s]
 * negate:    [e23, e31, e12, s] = [-e23, -e31, -e12, -s]
*/
export class RotorElement {
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Rotor;
  }
}

createPGAElement(RotorElement, {
  basis: ['e23', 'e31', 'e12', 's'],
  name: formatPGAType(PGATypes.Rotor),
});

/* === Rotor factory ===
 *
 * (x, y, z, s) -> Rotor((x * e23), (y * e31), (z * e12), (s * s))
*/
export const Rotor = (x = 0, y = 0, z = 0, s = 0) => (
  new RotorElement(new Float32Array([x, y, z, s]))
);
