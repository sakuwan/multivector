import {
  PGATypes,
  formatPGAType,
} from '../types';

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
 * === Norm / Normalization ===
 *
 * Rotor k-vectors: [e23, e31, e12, s]
 * Rotor metric: [-1, -1, -1, 1]
 *
 * norm: No components vanish
 * infinity norm: ||R||∞ = ||T||
 *
 * normalize: R * ∼R = 1
 * invert: R * R⁻¹ = 1
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

  from(x, y, z, s = 0) {
    const { buffer: v } = this;

    const cosTheta = Math.cos(0.5 * s);

    const norm = (x * x + y * y + z * z);
    if (norm === 0) {
      v[0] = 0;
      v[1] = 0;
      v[2] = 0;
      v[3] = cosTheta;
    }

    const sinTheta = Math.sin(0.5 * s) * (1.0 / norm) ** 0.5;

    v[0] = x * sinTheta;
    v[1] = y * sinTheta;
    v[2] = z * sinTheta;
    v[3] = cosTheta;

    return this;
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

    const norm = (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
    if (norm === 0) { v.fill(0); return this; }

    const invNorm = (1.0 / norm) ** 0.5;

    v[0] *= invNorm;
    v[1] *= invNorm;
    v[2] *= invNorm;
    v[3] *= invNorm;

    return this;
  }

  invert() {
    const { buffer: v } = this;

    const norm = (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (norm === 0) { v.fill(0); return this; }

    const invNorm = (1.0 / norm);

    v[0] *= -invNorm;
    v[1] *= -invNorm;
    v[2] *= -invNorm;
    v[3] *= invNorm;

    return this;
  }
}

createPGAElement(RotorElement, {
  basis: ['e23', 'e31', 'e12', 's'],
  name: formatPGAType(PGATypes.Rotor),
});

/* === Rotor factory ===
 *
 * (x, y, z, s) -> Rotor((x * e23), (y * e31), (z * e12), (s * s))
 * Construct a normalized rotor along the provided axis, rotated by s
*/
export const Rotor = (x = 0, y = 0, z = 0, s = 0) => {
  const cosTheta = Math.cos(0.5 * s);

  const norm = (x * x + y * y + z * z);
  if (norm === 0) return new RotorElement(new Float32Array([0, 0, 0, cosTheta]));

  const sinTheta = Math.sin(0.5 * s) * (1.0 / norm) ** 0.5;
  return new RotorElement(new Float32Array([
    x * sinTheta,
    y * sinTheta,
    z * sinTheta,
    cosTheta,
  ]));
};
