/* === Elements === */
import { PlaneElement } from '../../elements/Plane';
import { IdealElement } from '../../elements/IdealLine';
import { OriginElement } from '../../elements/OriginLine';
import { LineElement } from '../../elements/Line';
import { PointElement } from '../../elements/Point';
import { MotorElement } from '../../elements/Motor';
import { RotorElement } from '../../elements/Rotor';
import { TranslatorElement } from '../../elements/Translator';
import { MultivectorElement } from '../../elements/Multivector';

/* === Implementations === */
import {
  PGATypes,
  formatPGAType,
} from '../../types';

import * as GP from '../../math/operators/geometric';
import * as IP from '../../math/operators/inner';
import * as OP from '../../math/operators/outer';
import * as RP from '../../math/operators/regressive';
import * as SP from '../../math/operators/sandwich';
import * as Duality from '../../math/operators/dual';

/* === Helpers === */
import {
  entry,
  dispatch,
} from '../dispatch';

import VanishingError from '../../utils/error/VanishingError';
import UnsupportedError from '../../utils/error/UnsupportedError';

/* === Shortened PGA element types ===
 *
 * Since the multiple dispatch maps are quite verbose, it's easier to shorten
 * the amount of PGATypes.X calls into single letter representations and
 * cross reference the mapped dispatch against the implementation for clarity
*/
const {
  Plane: p,
  IdealLine: I,
  OriginLine: O,
  Line: L,
  Point: P,
  Motor: M,
  Rotor: R,
  Translator: T,
} = PGATypes;

/* === Element type multiple dispatch ===
 *
 * Dispatch PGA operator calls to their proper implementation based on the
 * input types, using the multiple dispatch logic from './helpers/dispatch.js'
*/

/* === Geometric product multiple dispatch ===
 *
 * Refer to 'math/geometric.js' for implementation details
 * Throws a VanishingError on fully vanishing or potentially invalid operations
*/
export const geometricMultimethod = dispatch(
  false,
  (a, b) => { throw new VanishingError(`[${formatPGAType(a)}*${formatPGAType(b)}]`); },

  /* === Lhs plane element === */
  entry(p, p, (a, b) => new MotorElement(GP.geometricPlanePlane(a, b))),
  entry(p, I, (a, b) => new MultivectorElement(GP.geometricPlaneIdeal(a, b))),
  entry(p, O, (a, b) => new MultivectorElement(GP.geometricPlaneOrigin(a, b))),
  entry(p, L, (a, b) => new MultivectorElement(GP.geometricPlaneLine(a, b))),
  entry(p, P, (a, b) => new MotorElement(GP.geometricPlanePoint(a, b))),

  /* === Lhs ideal element === */
  entry(I, p, (a, b) => new MultivectorElement(GP.geometricIdealPlane(a, b))),
  entry(I, O, (a, b) => new IdealElement(GP.geometricIdealOrigin(a, b))),
  entry(I, L, (a, b) => new IdealElement(GP.geometricIdealLine(a, b))),
  entry(I, P, (a, b) => new MultivectorElement(GP.geometricIdealPoint(a, b))),

  /* === Lhs origin element === */
  entry(O, p, (a, b) => new MultivectorElement(GP.geometricOriginPlane(a, b))),
  entry(O, I, (a, b) => new IdealElement(GP.geometricOriginIdeal(a, b))),
  entry(O, O, (a, b) => new RotorElement(GP.geometricOriginOrigin(a, b))),
  entry(O, L, (a, b) => new MotorElement(GP.geometricOriginLine(a, b))),
  entry(O, P, (a, b) => new MultivectorElement(GP.geometricOriginPoint(a, b))),

  /* === Lhs line element === */
  entry(L, p, (a, b) => new MultivectorElement(GP.geometricLinePlane(a, b))),
  entry(L, I, (a, b) => new IdealElement(GP.geometricLineIdeal(a, b))),
  entry(L, O, (a, b) => new MotorElement(GP.geometricLineOrigin(a, b))),
  entry(L, L, (a, b) => new MotorElement(GP.geometricLineLine(a, b))),
  entry(L, P, (a, b) => new MultivectorElement(GP.geometricLinePoint(a, b))),

  /* === Lhs point element === */
  entry(P, p, (a, b) => new MotorElement(GP.geometricPointPlane(a, b))),
  entry(P, I, (a, b) => new MultivectorElement(GP.geometricPointIdeal(a, b))),
  entry(P, O, (a, b) => new MultivectorElement(GP.geometricPointOrigin(a, b))),
  entry(P, L, (a, b) => new MultivectorElement(GP.geometricPointLine(a, b))),
  entry(P, P, (a, b) => new TranslatorElement(GP.geometricPointPoint(a, b))),

  /* === Lhs motor element === */
  entry(M, M, (a, b) => new MotorElement(GP.geometricMotorMotor(a, b))),
  entry(M, R, (a, b) => new MotorElement(GP.geometricMotorRotor(a, b))),
  entry(M, T, (a, b) => new MotorElement(GP.geometricMotorTranslator(a, b))),

  /* === Lhs rotor element === */
  entry(R, M, (a, b) => new MotorElement(GP.geometricRotorMotor(a, b))),
  entry(R, R, (a, b) => new RotorElement(GP.geometricRotorRotor(a, b))),
  entry(R, T, (a, b) => new MotorElement(GP.geometricRotorTranslator(a, b))),

  /* === Lhs translator element === */
  entry(T, M, (a, b) => new MotorElement(GP.geometricTranslatorMotor(a, b))),
  entry(T, R, (a, b) => new MotorElement(GP.geometricTranslatorRotor(a, b))),
  entry(T, T, (a, b) => new TranslatorElement(GP.geometricTranslatorTranslator(a, b))),
);

/* === Inner product multiple dispatch ===
 *
 * Refer to 'math/inner.js' for implementation details
 * Throws a VanishingError on fully vanishing or potentially invalid operations
*/
export const innerMultimethod = dispatch(
  false,
  (a, b) => { throw new VanishingError(`[${formatPGAType(a)}∙${formatPGAType(b)}]`); },

  /* === Lhs plane element === */
  entry(p, p, (a, b) => IP.innerPlanePlane(a, b)),
  entry(p, I, (a, b) => new PlaneElement(IP.innerPlaneIdeal(a, b))),
  entry(p, O, (a, b) => new PlaneElement(IP.innerPlaneOrigin(a, b))),
  entry(p, L, (a, b) => new PlaneElement(IP.innerPlaneLine(a, b))),
  entry(p, P, (a, b) => new LineElement(IP.innerPlanePoint(a, b))),

  /* === Lhs ideal element === */
  entry(I, p, (a, b) => new PlaneElement(IP.innerIdealPlane(a, b))),

  /* === Lhs origin element === */
  entry(O, p, (a, b) => new PlaneElement(IP.innerOriginPlane(a, b))),
  entry(O, O, (a, b) => IP.innerOriginOrigin(a, b)),
  entry(O, L, (a, b) => IP.innerOriginLine(a, b)),
  entry(O, P, (a, b) => new PlaneElement(IP.innerOriginPoint(a, b))),

  /* === Lhs line element === */
  entry(L, p, (a, b) => new PlaneElement(IP.innerLinePlane(a, b))),
  entry(L, O, (a, b) => IP.innerLineOrigin(a, b)),
  entry(L, L, (a, b) => IP.innerLineLine(a, b)),
  entry(L, P, (a, b) => new PlaneElement(IP.innerLinePoint(a, b))),

  /* === Lhs point element === */
  entry(P, p, (a, b) => new LineElement(IP.innerPointPlane(a, b))),
  entry(P, O, (a, b) => new PlaneElement(IP.innerPointOrigin(a, b))),
  entry(P, L, (a, b) => new PlaneElement(IP.innerPointLine(a, b))),
  entry(P, P, (a, b) => IP.innerPointPoint(a, b)),
);

/* === Outer product multiple dispatch ===
 *
 * Refer to 'math/outer.js' for implementation details
 * Throws a VanishingError on fully vanishing or potentially invalid operations
*/
export const outerMultimethod = dispatch(
  false,
  (a, b) => { throw new VanishingError(`[${formatPGAType(a)}∧${formatPGAType(b)}]`); },

  /* === Lhs plane element === */
  entry(p, p, (a, b) => new LineElement(OP.outerPlanePlane(a, b))),
  entry(p, I, (a, b) => new PointElement(OP.outerPlaneIdeal(a, b))),
  entry(p, O, (a, b) => new PointElement(OP.outerPlaneOrigin(a, b))),
  entry(p, L, (a, b) => new PointElement(OP.outerPlaneLine(a, b))),
  entry(p, P, (a, b) => OP.outerPlanePoint(a, b)),

  /* === Lhs ideal element === */
  entry(I, p, (a, b) => new PointElement(OP.outerIdealPlane(a, b))),
  entry(I, O, (a, b) => OP.outerIdealOrigin(a, b)),
  entry(I, L, (a, b) => OP.outerIdealLine(a, b)),

  /* === Lhs origin element === */
  entry(O, p, (a, b) => new PointElement(OP.outerOriginPlane(a, b))),
  entry(O, I, (a, b) => OP.outerOriginIdeal(a, b)),
  entry(O, L, (a, b) => OP.outerOriginLine(a, b)),

  /* === Lhs line element === */
  entry(L, p, (a, b) => new PointElement(OP.outerLinePlane(a, b))),
  entry(L, I, (a, b) => OP.outerLineIdeal(a, b)),
  entry(L, O, (a, b) => OP.outerLineOrigin(a, b)),
  entry(L, L, (a, b) => OP.outerLineLine(a, b)),

  /* === Lhs point element === */
  entry(P, p, (a, b) => OP.outerPointPlane(a, b)),
);

/* === Regressive product multiple dispatch ===
 *
 * Refer to 'math/regressive.js' for implementation details
 * Throws a VanishingError on fully vanishing or potentially invalid operations
*/
export const regressiveMultimethod = dispatch(
  false,
  (a, b) => { throw new VanishingError(`[${formatPGAType(a)}∨${formatPGAType(b)}]`); },

  /* === Lhs plane element === */
  entry(p, P, (a, b) => RP.regressivePlanePoint(a, b)),

  /* === Lhs ideal element === */
  entry(I, O, (a, b) => RP.regressiveIdealOrigin(a, b)),
  entry(I, L, (a, b) => RP.regressiveIdealLine(a, b)),
  entry(I, P, (a, b) => new PlaneElement(RP.regressiveIdealPoint(a, b))),

  /* === Lhs origin element === */
  entry(O, I, (a, b) => RP.regressiveOriginIdeal(a, b)),
  entry(O, L, (a, b) => RP.regressiveOriginLine(a, b)),
  entry(O, P, (a, b) => new PlaneElement(RP.regressiveOriginPoint(a, b))),

  /* === Lhs line element === */
  entry(L, I, (a, b) => RP.regressiveLineIdeal(a, b)),
  entry(L, O, (a, b) => RP.regressiveLineOrigin(a, b)),
  entry(L, L, (a, b) => RP.regressiveLineLine(a, b)),
  entry(L, P, (a, b) => new PlaneElement(RP.regressiveLinePoint(a, b))),

  /* === Lhs point element === */
  entry(P, p, (a, b) => RP.regressivePointPlane(a, b)),
  entry(P, I, (a, b) => new PlaneElement(RP.regressivePointIdeal(a, b))),
  entry(P, O, (a, b) => new PlaneElement(RP.regressivePointOrigin(a, b))),
  entry(P, L, (a, b) => new PlaneElement(RP.regressivePointLine(a, b))),
  entry(P, P, (a, b) => new LineElement(RP.regressivePointPoint(a, b))),
);

/* === Sandwich product multiple dispatch ===
 *
 * Refer to 'math/sandwich.js' for implementation details
 * Throws a VanishingError on fully vanishing or potentially invalid operations
*/
export const sandwichMultimethod = dispatch(
  false,
  (a, b) => { throw new VanishingError(`[${formatPGAType(a)}≡${formatPGAType(b)}]`); },

  /* === Lhs plane element === */
  entry(p, p, (a, b) => new PlaneElement(SP.sandwichPlanePlane(a, b))),
  entry(p, M, (a, b) => new PlaneElement(SP.sandwichPlaneMotor(a, b))),
  entry(p, R, (a, b) => new PlaneElement(SP.sandwichSimpleRotor(a, b))),
  entry(p, T, (a, b) => new PlaneElement(SP.sandwichPlaneTranslator(a, b))),

  /* === Lhs origin element === */
  entry(O, R, (a, b) => new OriginElement(SP.sandwichSimpleRotor(a, b))),

  /* === Lhs line element === */
  entry(L, p, (a, b) => new LineElement(SP.sandwichLinePlane(a, b))),
  entry(L, M, (a, b) => new LineElement(SP.sandwichLineMotor(a, b))),
  entry(L, R, (a, b) => new LineElement(SP.sandwichLineRotor(a, b))),
  entry(L, T, (a, b) => new LineElement(SP.sandwichLineTranslator(a, b))),

  /* === Lhs point element === */
  entry(P, p, (a, b) => new PointElement(SP.sandwichPointPlane(a, b))),
  entry(P, M, (a, b) => new PointElement(SP.sandwichPointMotor(a, b))),
  entry(P, R, (a, b) => new PointElement(SP.sandwichSimpleRotor(a, b))),
  entry(P, T, (a, b) => new PointElement(SP.sandwichPointTranslator(a, b))),
);

/* === Poincare duality map multiple dispatch ===
 *
 * Refer to 'math/dual.js' for implementation details
 * Throws an UnsupportedError on invalid operations
*/
export const dualMultimethod = dispatch(
  true,
  () => { throw new UnsupportedError(); },

  entry(p, (a) => new PointElement(Duality.dualPlane(a))),
  entry(I, (a) => new OriginElement(Duality.dualIdeal(a))),
  entry(O, (a) => new IdealElement(Duality.dualOrigin(a))),
  entry(L, (a) => new LineElement(Duality.dualLine(a))),
  entry(P, (a) => new PlaneElement(Duality.dualPoint(a))),
);
