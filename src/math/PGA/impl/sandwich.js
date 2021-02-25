/* === PGA (3, 0, 1) sandwich products ===
 *
 * Sandwich products are the implementation of geometric reflections in PGA,
 * represented by a normalized multivector surrounding the element to be
 * reflected, such as aXa, where X represented the element and a represents the
 * mirror. These optimized implementations represent the common sandwich
 * operators, such as reflecting through planes and applying all versors
*/

import { PGATypes } from './types';

/* === Plane reflections ===
 *
 * p₁p₂p₁ -> Reflect plane p₁ through plane p₂ -> p₂ * p₁ * p₂
 * p ℓ p  -> Reflect line ℓ through plane p    -> p * ℓ * p
 * p P p  -> Reflect point P through plane p   -> p * P * p
*/

export const sandwichPlanePlane = (a, b) => {
  const a0b0 = a[0] * b[0]; // a.e1 * b.e1
  const a1b1 = a[1] * b[1]; // a.e2 * b.e2
  const a2b2 = a[2] * b[2]; // a.e3 * b.e3

  const b0sq = b[0] * b[0]; // b.e1 * b.e1
  const b1sq = b[1] * b[1]; // b.e2 * b.e2
  const b2sq = b[2] * b[2]; // b.e3 * b.e3

  const e1 = 2 * b[0] * (a1b1 + a2b2) + a[0] * (b0sq - b1sq - b2sq);
  const e2 = 2 * b[1] * (a2b2 + a0b0) + a[1] * (b1sq - b2sq - b0sq);
  const e3 = 2 * b[2] * (a0b0 + a1b1) + a[2] * (b2sq - b0sq - b1sq);
  const e0 = 2 * b[3] * (a0b0 + a1b1 + a2b2) - a[3] * (b0sq + b1sq + b2sq);

  return new Float32Array([e1, e2, e3, e0]);
};

export const sandwichLinePlane = (a, b) => {
  const a0b0 = a[0] * b[0]; // a.e01 * b.e1
  const a1b1 = a[1] * b[1]; // a.e02 * b.e2
  const a2b2 = a[2] * b[2]; // a.e03 * b.e3
  const a4b0 = a[4] * b[0]; // a.e23 * b.e1
  const a5b1 = a[5] * b[1]; // a.e31 * b.e2
  const a6b2 = a[6] * b[2]; // a.e12 * b.e3

  const b0sq = b[0] * b[0]; // b.e1 * b.e1
  const b1sq = b[1] * b[1]; // b.e2 * b.e2
  const b2sq = b[2] * b[2]; // b.e3 * b.e3

  const e01 = 2 * b[3] * (a[6] * b[1] - a[5] * b[2])
            - 2 * b[0] * (a1b1 + a2b2) + a[0] * (b1sq + b2sq - b0sq);

  const e02 = 2 * b[3] * (a[4] * b[2] - a[6] * b[0])
            - 2 * b[1] * (a2b2 + a0b0) + a[1] * (b2sq + b0sq - b1sq);

  const e03 = 2 * b[3] * (a[5] * b[0] - a[4] * b[1])
            - 2 * b[2] * (a0b0 + a1b1) + a[2] * (b0sq + b1sq - b2sq);

  const e0123 = -a[3] * (b0sq + b1sq + b2sq);

  const e23 = 2 * b[0] * (a5b1 + a6b2) + a[4] * (b0sq - b1sq - b2sq);
  const e31 = 2 * b[1] * (a6b2 + a4b0) + a[5] * (b1sq - b2sq - b0sq);
  const e12 = 2 * b[2] * (a4b0 + a5b1) + a[6] * (b2sq - b0sq - b1sq);
  const s = a[7] * (b0sq + b1sq + b2sq);

  return new Float32Array([e01, e02, e03, e0123, e23, e31, e12, s]);
};

export const sandwichPointPlane = (a, b) => {
  const a0b0 = a[0] * b[0]; // a.e032 * b.e1
  const a1b1 = a[1] * b[1]; // a.e013 * b.e2
  const a2b2 = a[2] * b[2]; // a.e021 * b.e3
  const a3b3 = a[3] * b[3]; // a.e123 * b.e0

  const b0sq = b[0] * b[0]; // b.e1 * b.e1
  const b1sq = b[1] * b[1]; // b.e2 * b.e2
  const b2sq = b[2] * b[2]; // b.e3 * b.e3

  const e032 = -2 * b[0] * (a1b1 + a2b2 + a3b3) + a[0] * (b1sq + b2sq - b0sq);
  const e013 = -2 * b[1] * (a0b0 + a2b2 + a3b3) + a[1] * (b2sq + b0sq - b1sq);
  const e021 = -2 * b[2] * (a0b0 + a1b1 + a3b3) + a[2] * (b0sq + b1sq - b2sq);
  const e123 = a[3] * (b0sq + b1sq + b2sq);

  return new Float32Array([e032, e013, e021, e123]);
};

/* === Rotor sandwich operators ===
 *
 * R p R -> Apply rotor R to plane p -> R * p * ∼R
 * R ℓ R -> Apply rotor R to line ℓ  -> R * ℓ * ∼R
 * R P R -> Apply rotor R to point P -> R * P * ∼R
*/

export const sandwichPlaneRotor = (a, b) => {
  const b0b1 = b[0] * b[1]; // b.e23 * b.e31
  const b0b2 = b[0] * b[2]; // b.e23 * b.e12
  const b0b3 = b[0] * b[3]; // b.e23 * b.s
  const b1b2 = b[1] * b[2]; // b.e31 * b.e12
  const b1b3 = b[1] * b[3]; // b.e31 * b.s
  const b2b3 = b[2] * b[3]; // b.e12 * b.s

  const b0sq = b[0] * b[0]; // b.e23 * b.e23
  const b1sq = b[1] * b[1]; // b.e31 * b.e31
  const b2sq = b[2] * b[2]; // b.e12 * b.e12
  const b3sq = b[3] * b[3]; // b.s * b.s

  const e1 = 2 * a[1] * (b0b1 + b2b3)
           + 2 * a[2] * (b0b2 - b1b3) + a[0] * (b3sq + b0sq - b2sq - b1sq);

  const e2 = 2 * a[2] * (b0b3 + b1b2)
           + 2 * a[0] * (b0b1 - b2b3) + a[1] * (b3sq + b1sq - b0sq - b2sq);

  const e3 = 2 * a[0] * (b1b3 + b0b2)
           + 2 * a[1] * (b1b2 - b0b3) + a[2] * (b3sq + b2sq - b1sq - b0sq);

  const e0 = a[3] * (b0sq + b1sq + b2sq + b3sq);

  return new Float32Array([e1, e2, e3, e0]);
};

export const sandwichLineRotor = (a, b) => {

};

export const sandwichPointRotor = (a, b) => {
  const b0b1 = b[0] * b[1]; // b.e23 * b.e31
  const b0b2 = b[0] * b[2]; // b.e23 * b.e12
  const b0b3 = b[0] * b[3]; // b.e23 * b.s
  const b1b2 = b[1] * b[2]; // b.e31 * b.e12
  const b1b3 = b[1] * b[3]; // b.e31 * b.s
  const b2b3 = b[2] * b[3]; // b.e12 * b.s

  const b0sq = b[0] * b[0]; // b.e23 * b.e23
  const b1sq = b[1] * b[1]; // b.e31 * b.e31
  const b2sq = b[2] * b[2]; // b.e12 * b.e12
  const b3sq = b[3] * b[3]; // b.s * b.s

  const e1 = 2 * a[1] * (b0b1 + b2b3)
           + 2 * a[2] * (b0b2 - b1b3) + a[0] * (b3sq + b0sq - b2sq - b1sq);

  const e2 = 2 * a[2] * (b0b3 + b1b2)
           + 2 * a[0] * (b0b1 - b2b3) + a[1] * (b3sq + b1sq - b0sq - b2sq);

  const e3 = 2 * a[0] * (b1b3 + b0b2)
           + 2 * a[1] * (b1b2 - b0b3) + a[2] * (b3sq + b2sq - b1sq - b0sq);

  const e0 = a[3] * (b0sq + b1sq + b2sq + b3sq);

  return new Float32Array([e1, e2, e3, e0]);
};

/* === Translator sandwich operators ===
 *
 * T p T -> Apply translator T to plane p -> T * p * ∼T
 * T ℓ T -> Apply translator T to line ℓ  -> T * ℓ * ∼T
 * T P T -> Apply translator T to point P -> T * P * ∼T
*/

export const sandwichPlaneTranslator = (a, b) => {
  const e1 = a[0];
  const e2 = a[1];
  const e3 = a[2];
  const e0 = a[3] + 2 * (1.0 / (b[3] + 1)) * (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);

  return new Float32Array([e1, e2, e3, e0]);
};

export const sandwichLineTranslator = (a, b) => {
  const e01 = a[0] + 2 * (a[5] * b[2] - a[6] * b[1] - a[4] * b[3]);
  const e02 = a[1] + 2 * (a[6] * b[0] - a[4] * b[2] - a[5] * b[3]);
  const e03 = a[2] + 2 * (a[4] * b[1] - a[5] * b[0] - a[6] * b[3]);
  const e0123 = a[3] + 2 * a[7] * b[3];

  const e23 = a[4];
  const e31 = a[5];
  const e12 = a[6];
  const s = a[7];

  return new Float32Array([e01, e02, e03, e0123, e23, e31, e12, s]);
};

export const sandwichPointTranslator = (a, b) => {
  const e032 = a[0] - 2 * a[3] * b[0];
  const e013 = a[1] - 2 * a[3] * b[1];
  const e021 = a[2] - 2 * a[3] * b[2];
  const e123 = a[3];

  return new Float32Array([e032, e013, e021, e123]);
};

export const sandwichProductMap = {
  [PGATypes.Plane]: {
    [PGATypes.Plane]: [sandwichPlanePlane, PGATypes.Plane],
    [PGATypes.Rotor]: [sandwichPlaneRotor, PGATypes.Plane],
    [PGATypes.Translator]: [sandwichPlaneTranslator, PGATypes.Plane],
  },

  [PGATypes.Line]: {
    [PGATypes.Plane]: [sandwichLinePlane, PGATypes.Line],
    [PGATypes.Translator]: [sandwichLineTranslator, PGATypes.Line],
  },

  [PGATypes.Point]: {
    [PGATypes.Plane]: [sandwichPointPlane, PGATypes.Point],
    [PGATypes.Rotor]: [sandwichPointRotor, PGATypes.Point],
    [PGATypes.Translator]: [sandwichPointTranslator, PGATypes.Point],
  },
};
