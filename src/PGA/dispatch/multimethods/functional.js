/* === Elements === */
import { IdealElement } from '../../elements/IdealLine';
import { OriginElement } from '../../elements/OriginLine';
import { LineElement } from '../../elements/Line';
import { MotorElement } from '../../elements/Motor';
import { RotorElement } from '../../elements/Rotor';
import { TranslatorElement } from '../../elements/Translator';

/* === Implementations === */
import { PGATypes } from '../../types';

import * as Exp from '../../math/functional/exp';
import * as Log from '../../math/functional/log';
import * as Sqrt from '../../math/functional/sqrt';

/* === Helpers === */
import {
  entry,
  dispatch,
} from '../dispatch';

import UnsupportedError from '../../utils/error/UnsupportedError';

/* === Shortened PGA element types ===
 *
 * Since the multiple dispatch maps are quite verbose, it's easier to shorten
 * the amount of PGATypes.X calls into single letter representations and
 * cross reference the mapped dispatch against the implementation for clarity
*/
const {
  IdealLine: I,
  OriginLine: O,
  Line: L,
  Motor: M,
  Rotor: R,
  Translator: T,
} = PGATypes;

/* === Element type multiple dispatch ===
 *
 * Dispatch PGA operation calls to their proper implementation based on the
 * input types, using the multiple dispatch logic from './helpers/dispatch.js'
*/

/* === Exponentiation multiple dispatch ===
 *
 * Refer to 'math/exp.js' for implementation details
 * Throws an UnsupportedError on invalid operations
*/
export const expMultimethod = dispatch(
  true,
  () => { throw new UnsupportedError(); },

  entry(I, (a) => new TranslatorElement(Exp.expIdeal(a))),
  entry(O, (a) => new RotorElement(Exp.expOrigin(a))),
  entry(L, (a) => new MotorElement(Exp.expLine(a))),
);

/* === Logarithm multiple dispatch ===
 *
 * Refer to 'math/log.js' for implementation details
 * Throws an UnsupportedError on invalid operations
*/
export const logMultimethod = dispatch(
  true,
  () => { throw new UnsupportedError(); },

  entry(M, (a) => new LineElement(Log.logMotor(a))),
  entry(R, (a) => new OriginElement(Log.logRotor(a))),
  entry(T, (a) => new IdealElement(Log.logTranslator(a))),
);

/* === Square root multiple dispatch ===
 *
 * Refer to 'math/sqrt.js' for implementation details
 * Throws an UnsupportedError on invalid operations
*/
export const sqrtMultimethod = dispatch(
  true,
  () => { throw new UnsupportedError(); },

  entry(I, (a) => new TranslatorElement(Sqrt.sqrtTranslator(a))),
  entry(O, (a) => new RotorElement(Sqrt.sqrtRotor(a))),
  entry(L, (a) => new MotorElement(Sqrt.sqrtMotor(a))),
  entry(M, (a) => new MotorElement(Sqrt.sqrtMotor(a))),
  entry(R, (a) => new RotorElement(Sqrt.sqrtRotor(a))),
  entry(T, (a) => new TranslatorElement(Sqrt.sqrtTranslator(a))),
);
