/* === PGA vector space operations
 *
 * The PGA class provides the actual vector space operations and interactions
 * between elements, such as the inner, outer and regressive products.
 *
 * Specific products may be called, though generics are provided to properly
 * delegate elements to their respective implementations
*/

/* === Elements === */
import { PlaneElement } from './Plane';
import { IdealElement } from './IdealLine';
import { OriginElement } from './OriginLine';
import { LineElement } from './Line';
import { PointElement } from './Point';

import { MotorElement } from './Motor';
import { RotorElement } from './Rotor';
import { TranslatorElement } from './Translator';

import { MultivectorElement } from './Multivector';

/* === Implementations === */
import {
  PGATypes,
  formatPGAType,
} from './impl/types';

import { innerProductMap } from './impl/inner';
import { outerProductMap } from './impl/outer';
import { regressiveProductMap } from './impl/regressive';
import { geometricProductMap } from './impl/geometric';

import * as Duality from './impl/dual';

/* === Element type delegation maps ===
 *
 * Using the provided implementation map, create a wrapper that will result
 * in the proper element of the operation
*/
const createForwardingMap = (impl, operator) => {
  const wrapMethods = (a, b) => {
    const currentOp = `[${formatPGAType(a)}${operator}${formatPGAType(b)}]`;
    const errorMessage = `Invalid arguments: ${currentOp} is a vanishing or invalid operation`;

    const [method, result] = impl?.[a]?.[b] ?? [];
    if (!method) {
      return () => { throw new TypeError(errorMessage); };
    }

    switch (result) {
      case PGATypes.Scalar: return method;
      case PGATypes.Pseudoscalar: return method;

      case PGATypes.Plane: return (lhs, rhs) => new PlaneElement(method(lhs, rhs));
      case PGATypes.IdealLine: return (lhs, rhs) => new IdealElement(method(lhs, rhs));
      case PGATypes.OriginLine: return (lhs, rhs) => new OriginElement(method(lhs, rhs));
      case PGATypes.Line: return (lhs, rhs) => new LineElement(method(lhs, rhs));
      case PGATypes.Point: return (lhs, rhs) => new PointElement(method(lhs, rhs));

      case PGATypes.Motor: return (lhs, rhs) => new MotorElement(method(lhs, rhs));
      case PGATypes.Rotor: return (lhs, rhs) => new RotorElement(method(lhs, rhs));
      case PGATypes.Translator: return (lhs, rhs) => new TranslatorElement(method(lhs, rhs));

      case PGATypes.Multivector: return (lhs, rhs) => new MultivectorElement(method(lhs, rhs));

      default: {
        throw new TypeError('Invalid type: Unsupported result type');
      }
    }
  };

  const makeRhsElements = (lhs) => (a, rhs) => Object.assign(
    a, { [rhs]: wrapMethods(lhs, rhs) },
  );

  const makeLhsElements = (a, lhs, _, arr) => Object.assign(
    a, { [lhs]: arr.reduce(makeRhsElements(lhs), {}) },
  );

  const validElements = [
    PGATypes.Plane,
    PGATypes.IdealLine, PGATypes.OriginLine, PGATypes.Line,
    PGATypes.Point,
    PGATypes.Motor, PGATypes.Rotor, PGATypes.Translator,
    PGATypes.Multivector,
  ];

  return validElements.reduce(makeLhsElements, {});
};

export default class PGA {
  static innerMap = createForwardingMap(innerProductMap, '∙');

  static dot(a, b) {
    const lhsType = a.type();
    const rhsType = b.type();

    return PGA.innerMap[lhsType][rhsType](a.buffer, b.buffer);
  }

  static outerMap = createForwardingMap(outerProductMap, '∧');

  static meet(a, b) {
    const lhsType = a.type();
    const rhsType = b.type();

    return PGA.outerMap[lhsType][rhsType](a.buffer, b.buffer);
  }

  static regressiveMap = createForwardingMap(regressiveProductMap, '∨');

  static join(a, b) {
    const lhsType = a.type();
    const rhsType = b.type();

    return PGA.regressiveMap[lhsType][rhsType](a.buffer, b.buffer);
  }

  static geometricMap = createForwardingMap(geometricProductMap, '*');

  static mul(a, b) {
    const lhsType = a.type();
    const rhsType = b.type();

    return PGA.geometricMap[lhsType][rhsType](a.buffer, b.buffer);
  }

  static dual(a) {
    const { elementType } = a;
    switch (elementType) {
      case PGATypes.Plane: return new PointElement(Duality.dualPlane(a));
      case PGATypes.IdealLine: return new OriginElement(Duality.dualIdeal(a));
      case PGATypes.OriginLine: return new IdealElement(Duality.dualOrigin(a));
      case PGATypes.Line: return new LineElement(Duality.dualLine(a));
      case PGATypes.Point: return new PlaneElement(Duality.dualPoint(a));

      default: throw new TypeError('[PGA.dual] Invalid argument: Unsupported element type');
    }
  }
}
