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

/* === Motor sandwich operators ===
 *
 * M p M -> Apply motor M to plane p -> M * p * ∼M
 * M ℓ M -> Apply motor M to line ℓ  -> M * ℓ * ∼M
 * M P M -> Apply motor M to point P -> M * P * ∼M
*/

export const sandwichPlaneMotor = (a, b) => {
  const xAxisY = 2 * (b[4] * b[5] + b[6] * b[7]);
  const xAxisZ = 2 * (b[6] * b[4] - b[5] * b[7]);

  const yAxisZ = 2 * (b[5] * b[6] + b[4] * b[7]);
  const yAxisX = 2 * (b[4] * b[5] - b[6] * b[7]);

  const zAxisX = 2 * (b[6] * b[4] + b[5] * b[7]);
  const zAxisY = 2 * (b[5] * b[6] - b[4] * b[7]);

  const wAxisX = 2 * (b[7] * b[0] + b[5] * b[2] + b[4] * b[3] - b[6] * b[1]);
  const wAxisY = 2 * (b[7] * b[1] + b[6] * b[0] + b[5] * b[3] - b[4] * b[2]);
  const wAxisZ = 2 * (b[7] * b[2] + b[4] * b[1] + b[6] * b[3] - b[5] * b[0]);

  const xScalar = b[7] * b[7] + b[4] * b[4] - b[6] * b[6] - b[5] * b[5];
  const yScalar = b[7] * b[7] + b[5] * b[5] - b[4] * b[4] - b[6] * b[6];
  const zScalar = b[7] * b[7] + b[6] * b[6] - b[5] * b[5] - b[4] * b[4];
  const wScalar = b[4] * b[4] + b[5] * b[5] + b[6] * b[6] + b[7] * b[7];

  const e1 = a[1] * xAxisY + a[2] * xAxisZ + a[0] * xScalar;
  const e2 = a[2] * yAxisZ + a[0] * yAxisX + a[1] * yScalar;
  const e3 = a[0] * zAxisX + a[1] * zAxisY + a[2] * zScalar;
  const e0 = a[0] * wAxisX + a[1] * wAxisY + a[2] * wAxisZ + a[3] * wScalar;

  return new Float32Array([e1, e2, e3, e0]);
};

export const sandwichLineMotor = (a, b) => {
  const xAxisY = 2 * (b[4] * b[5] + b[6] * b[7]);
  const xAxisZ = 2 * (b[6] * b[4] - b[5] * b[7]);
  const yAxisZ = 2 * (b[5] * b[6] + b[4] * b[7]);
  const yAxisX = 2 * (b[4] * b[5] - b[6] * b[7]);
  const zAxisX = 2 * (b[6] * b[4] + b[5] * b[7]);
  const zAxisY = 2 * (b[5] * b[6] - b[4] * b[7]);

  const xScalar = b[7] * b[7] + b[4] * b[4] - b[6] * b[6] - b[5] * b[5];
  const yScalar = b[7] * b[7] + b[5] * b[5] - b[4] * b[4] - b[6] * b[6];
  const zScalar = b[7] * b[7] + b[6] * b[6] - b[5] * b[5] - b[4] * b[4];
  const wScalar = b[4] * b[4] + b[5] * b[5] + b[6] * b[6] + b[7] * b[7];

  const xDisplaceX = 2 * (b[4] * b[0] - b[7] * b[3] - b[6] * b[2] - b[5] * b[1]);
  const xDisplaceY = 2 * (b[4] * b[1] + b[7] * b[2] + b[5] * b[0] - b[6] * b[3]);
  const xDisplaceZ = 2 * (b[4] * b[2] + b[5] * b[3] + b[6] * b[0] - b[7] * b[1]);

  const yDisplaceX = 2 * (b[5] * b[0] + b[6] * b[3] + b[5] * b[1] - b[7] * b[2]);
  const yDisplaceY = 2 * (b[5] * b[1] - b[7] * b[3] - b[6] * b[2] - b[4] * b[0]);
  const yDisplaceZ = 2 * (b[5] * b[2] + b[7] * b[0] + b[6] * b[1] - b[4] * b[3]);

  const zDisplaceX = 2 * (b[6] * b[0] + b[7] * b[1] + b[4] * b[2] - b[5] * b[3]);
  const zDisplaceY = 2 * (b[6] * b[1] + b[4] * b[3] + b[5] * b[2] - b[7] * b[0]);
  const zDisplaceZ = 2 * (b[6] * b[2] - b[7] * b[3] - b[4] * b[0] - b[5] * b[1]);

  const wDisplaceW = 2 * (b[7] * b[3] - b[6] * b[2] - b[5] * b[1] - b[4] * b[0]);

  const e01 = a[4] * xDisplaceX + a[5] * xDisplaceY + a[6] * xDisplaceZ
            + a[1] * xAxisY + a[2] * xAxisZ + a[0] * xScalar;

  const e02 = a[4] * yDisplaceX + a[5] * yDisplaceY + a[6] * yDisplaceZ
            + a[2] * yAxisZ + a[0] * yAxisX + a[1] * yScalar;

  const e03 = a[4] * zDisplaceX + a[5] * zDisplaceY + a[6] * zDisplaceZ
            + a[0] * zAxisX + a[1] * zAxisY + a[2] * zScalar;

  const e0123 = a[7] * wDisplaceW + a[3] * wScalar;

  const e23 = a[5] * xAxisY + a[6] * xAxisZ + a[4] * xScalar;
  const e31 = a[6] * yAxisZ + a[4] * yAxisX + a[5] * yScalar;
  const e12 = a[4] * zAxisX + a[5] * zAxisY + a[6] * zScalar;
  const s = a[7] * wScalar;

  return new Float32Array([e01, e02, e03, e0123, e23, e31, e12, s]);
};

export const sandwichPointMotor = (a, b) => {
  const xAxisY = 2 * (b[4] * b[5] + b[6] * b[7]);
  const xAxisZ = 2 * (b[6] * b[4] - b[5] * b[7]);
  const xAxisW = 2 * (b[5] * b[2] - b[7] * b[0] - b[6] * b[1] - b[4] * b[3]);

  const yAxisZ = 2 * (b[5] * b[6] + b[4] * b[7]);
  const yAxisX = 2 * (b[4] * b[5] - b[6] * b[7]);
  const yAxisW = 2 * (b[6] * b[0] - b[7] * b[1] - b[4] * b[2] - b[5] * b[3]);

  const zAxisX = 2 * (b[6] * b[4] + b[5] * b[7]);
  const zAxisY = 2 * (b[5] * b[6] - b[4] * b[7]);
  const zAxisW = 2 * (b[4] * b[1] - b[7] * b[2] - b[5] * b[0] - b[6] * b[3]);

  const xScalar = b[7] * b[7] + b[4] * b[4] - b[6] * b[6] - b[5] * b[5];
  const yScalar = b[7] * b[7] + b[5] * b[5] - b[4] * b[4] - b[6] * b[6];
  const zScalar = b[7] * b[7] + b[6] * b[6] - b[5] * b[5] - b[4] * b[4];
  const wScalar = b[4] * b[4] + b[5] * b[5] + b[6] * b[6] + b[7] * b[7];

  const e032 = a[3] * xAxisW + a[1] * xAxisY + a[2] * xAxisZ + a[0] * xScalar;
  const e013 = a[3] * yAxisW + a[2] * yAxisZ + a[0] * yAxisX + a[1] * yScalar;
  const e021 = a[3] * zAxisW + a[0] * zAxisX + a[1] * zAxisY + a[2] * zScalar;
  const e123 = a[3] * wScalar;

  return new Float32Array([e032, e013, e021, e123]);
};

/* === Rotor sandwich operators ===
 *
 * R p R -> Apply rotor R to plane p -> R * p * ∼R
 * R ℓₒ R -> Apply rotor R to origin line ℓₒ  -> R * ℓₒ * ∼R
 * R ℓ R -> Apply rotor R to line ℓ  -> R * ℓ * ∼R
 * R P R -> Apply rotor R to point P -> R * P * ∼R
*/

export const sandwichSimpleRotor = (a, b) => {
  const xAxisY = 2 * (b[0] * b[1] + b[2] * b[3]);
  const xAxisZ = 2 * (b[2] * b[0] - b[1] * b[3]);
  const yAxisZ = 2 * (b[1] * b[2] + b[0] * b[3]);
  const yAxisX = 2 * (b[0] * b[1] - b[2] * b[3]);
  const zAxisX = 2 * (b[2] * b[0] + b[1] * b[3]);
  const zAxisY = 2 * (b[1] * b[2] - b[0] * b[3]);

  const xScalar = b[3] * b[3] + b[0] * b[0] - b[2] * b[2] - b[1] * b[1];
  const yScalar = b[3] * b[3] + b[1] * b[1] - b[0] * b[0] - b[2] * b[2];
  const zScalar = b[3] * b[3] + b[2] * b[2] - b[1] * b[1] - b[0] * b[0];
  const wScalar = b[0] * b[0] + b[1] * b[1] + b[2] * b[2] + b[3] * b[3];

  const x = a[1] * xAxisY + a[2] * xAxisZ + a[0] * xScalar;
  const y = a[2] * yAxisZ + a[0] * yAxisX + a[1] * yScalar;
  const z = a[0] * zAxisX + a[1] * zAxisY + a[2] * zScalar;
  const w = a[3] * wScalar;

  return new Float32Array([x, y, z, w]);
};

export const sandwichLineRotor = (a, b) => {
  const xAxisY = 2 * (b[0] * b[1] + b[2] * b[3]);
  const xAxisZ = 2 * (b[2] * b[0] - b[1] * b[3]);
  const yAxisZ = 2 * (b[1] * b[2] + b[0] * b[3]);
  const yAxisX = 2 * (b[0] * b[1] - b[2] * b[3]);
  const zAxisX = 2 * (b[2] * b[0] + b[1] * b[3]);
  const zAxisY = 2 * (b[1] * b[2] - b[0] * b[3]);

  const xScalar = b[3] * b[3] + b[0] * b[0] - b[2] * b[2] - b[1] * b[1];
  const yScalar = b[3] * b[3] + b[1] * b[1] - b[0] * b[0] - b[2] * b[2];
  const zScalar = b[3] * b[3] + b[2] * b[2] - b[1] * b[1] - b[0] * b[0];
  const wScalar = b[0] * b[0] + b[1] * b[1] + b[2] * b[2] + b[3] * b[3];

  const e01 = a[1] * xAxisY + a[2] * xAxisZ + a[0] * xScalar;
  const e02 = a[2] * yAxisZ + a[0] * yAxisX + a[1] * yScalar;
  const e03 = a[0] * zAxisX + a[1] * zAxisY + a[2] * zScalar;
  const e0123 = a[3] * wScalar;

  const e23 = a[5] * xAxisY + a[6] * xAxisZ + a[4] * xScalar;
  const e31 = a[6] * yAxisZ + a[4] * yAxisX + a[5] * yScalar;
  const e12 = a[4] * zAxisX + a[5] * zAxisY + a[6] * zScalar;
  const s = a[7] * wScalar;

  return new Float32Array([e01, e02, e03, e0123, e23, e31, e12, s]);
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
    [PGATypes.Motor]: [sandwichPlaneMotor, PGATypes.Plane],
    [PGATypes.Rotor]: [sandwichSimpleRotor, PGATypes.Plane],
    [PGATypes.Translator]: [sandwichPlaneTranslator, PGATypes.Plane],
  },

  [PGATypes.OriginLine]: {
    [PGATypes.Rotor]: [sandwichSimpleRotor, PGATypes.OriginLine],
  },

  [PGATypes.Line]: {
    [PGATypes.Plane]: [sandwichLinePlane, PGATypes.Line],
    [PGATypes.Motor]: [sandwichLineMotor, PGATypes.Line],
    [PGATypes.Rotor]: [sandwichLineRotor, PGATypes.Line],
    [PGATypes.Translator]: [sandwichLineTranslator, PGATypes.Line],
  },

  [PGATypes.Point]: {
    [PGATypes.Plane]: [sandwichPointPlane, PGATypes.Point],
    [PGATypes.Motor]: [sandwichPointMotor, PGATypes.Point],
    [PGATypes.Rotor]: [sandwichSimpleRotor, PGATypes.Point],
    [PGATypes.Translator]: [sandwichPointTranslator, PGATypes.Point],
  },
};
