import {
  PGATypes,
  formatPGAType,
} from './impl/types';

import createPGAElement from './PGAElement';

/* === Motor (e01, e02, e03, e0123, e23, e31, e12, s) ===
 *
 * Normalized, even grade elements of PGA are called motors, and are
 * generally represented as the products of rotors and translators. Motors
 * represent kinematic motion in PGA, and satisfy m * ∼m = 1
 *
 * === Component access ===
 *
 * get / set e01:   k-vector component access (0 / px)
 * get / set e02:   k-vector component access (1 / py)
 * get / set e03:   k-vector component access (2 / pz)
 * get / set e0123: k-vector component access (3 / I)
 *
 * get / set e23:   k-vector component access (4 / dx)
 * get / set e31:   k-vector component access (5 / dy)
 * get / set e12:   k-vector component access (6 / dz)
 * get / set s:     k-vector component access (7 / s)
 *
 * === Norm operations ===
 *
 * length, lengthSq
 * infinityLength, infinityLengthSq (Vanishes completely to 0)
 * euclideanLength, euclideanLengthSq
 *
 * normalize: Normalization satisfies m * ∼m = 1
 * invert: Inversion satisfies m * m⁻¹ = 1
 *
 * === Antiautomorphisms ===
 *
 * involute:  [e01, e02, e03, e0123, e23, e31, e12, s]
 *          = [e01, e02, e03, e0123, e23, e31, e12, s]
 *
 * reverse:   [e01, e02, e03, e0123, e23, e31, e12, s]
 *          = [-e01, -e02, -e03, e0123, -e23, -e31, -e12, s]
 *
 * conjugate: [e01, e02, e03, e0123, e23, e31, e12, s]
 *          = [-e01, -e02, -e03, e0123, -e23, -e31, -e12, s]
 *
 * negate:    [e01, e02, e03, e0123, e23, e31, e12, s]
 *          = [-e01, -e02, -e03, -e0123, -e23, -e31, -e12, -s]
*/
export class MotorElement {
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Motor;
  }
}

const MOTOR_BASIS = ['e01', 'e02', 'e03', 'e0123', 'e23', 'e31', 'e12', 's'];
createPGAElement(MotorElement, formatPGAType(PGATypes.Motor), MOTOR_BASIS);

/* === Motor factory ===
 *
 * (a, b, c, d, e, f, g, h) -> Motor(
 *   (a * e01), (b * e02), (c * e03), (d * e0123)),
 *   (e * e23), (f * e31), (g * e12), (h * s)),
 * )
*/
export const Motor = (a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0) => (
  new MotorElement(new Float32Array([a, b, c, d, e, f, g, h]))
);
