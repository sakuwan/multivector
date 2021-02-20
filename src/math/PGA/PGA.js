/* === PGA vector space operations
 *
 * The PGA class provides the actual vector space operations and interactions
 * between elements, such as the inner, outer and regressive products.
 *
 * Specific products may be called, though generics are provided to properly
 * delegate elements to their respective implementations
*/

/* === Elements === */
import { PlaneElement } from './elements/Plane';
import { IdealElement } from './elements/IdealLine';
import { OriginElement, OriginLine } from './elements/OriginLine';
import { LineElement } from './elements/Line';
import { PointElement } from './elements/Point';

import { MotorElement } from './elements/Motor';
import { RotorElement } from './elements/Rotor';
import { TranslatorElement } from './elements/Translator';

import { MultivectorElement } from './elements/Multivector';

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
    if (!method) { return () => { throw new TypeError(errorMessage); }; }

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

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }

  static exp(a) {
    const { elementType } = a;

    switch (elementType) {
      case PGATypes.IdealLine: {
        const translatorBuffer = new Float32Array([
          a.e01, a.e02, a.e03, 1,
        ]);

        return new TranslatorElement(translatorBuffer);
      }

      case PGATypes.OriginLine: {
        const theta = (a.e23 * a.e23 + a.e31 * a.e31 + a.e12 * a.e12) ** 0.5;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta) / theta;

        const rotorBuffer = new Float32Array([
          a.e23 * sinTheta,
          a.e31 * sinTheta,
          a.e12 * sinTheta,
          a.s * sinTheta + cosTheta,
        ]);

        return new RotorElement(rotorBuffer);
      }

      case PGATypes.Line: {
        const u2 = a.e23 * a.e23 + a.e31 * a.e31 + a.e12 * a.e12;
        const uv = a.e23 * a.e01 + a.e31 * a.e02 + a.e12 * a.e03;

        const invSq = (1.0 / u2) ** 0.5;
        const p = (1.0 / u2) * invSq * uv;

        const cosTheta = Math.cos(u2 * invSq);
        const sinTheta = Math.sin(u2 * invSq);

        const e01 = (a.e01 * invSq) - (a.e23 * p);
        const e02 = (a.e02 * invSq) - (a.e31 * p);
        const e03 = (a.e03 * invSq) - (a.e12 * p);
        const e0123 = (a.e0123 * invSq) - (a.s * p);

        const motorBuffer = new Float32Array([
          (e01 * sinTheta) + (a.e23 * invSq * cosTheta * uv * invSq),
          (e02 * sinTheta) + (a.e31 * invSq * cosTheta * uv * invSq),
          (e03 * sinTheta) + (a.e12 * invSq * cosTheta * uv * invSq),
          (e0123 * sinTheta) + (sinTheta * uv * invSq),
          a.e23 * invSq * sinTheta,
          a.e31 * invSq * sinTheta,
          a.e12 * invSq * sinTheta,
          a.s * invSq * sinTheta + cosTheta,
        ]);

        return new MotorElement(motorBuffer);
      }

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }

  static log(a) {
    const { elementType } = a;

    switch (elementType) {
      case PGATypes.Motor: {
        return a;
      }

      case PGATypes.Rotor: {
        const theta = Math.acos(a.s);
        const invTheta = (1.0 / Math.sin(theta));

        const originBuffer = new Float32Array([
          a.e23 * invTheta * theta,
          a.e31 * invTheta * theta,
          a.e12 * invTheta * theta,
          0,
        ]);

        return new OriginElement(originBuffer);
      }

      case PGATypes.Translator: {
        const idealBuffer = new Float32Array([
          a.e01, a.e02, a.e03, 0,
        ]);

        return new IdealElement(idealBuffer);
      }

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }

  static sqrt(a) {
    const { elementType } = a;

    switch (elementType) {
      case PGATypes.Motor: {
        const motorBuffer = new Float32Array([
          a.e01, a.e02, a.e03, a.e0123,
          a.e23, a.e31, a.e12, (a.s + 1),
        ]);

        return new MotorElement(motorBuffer).normalize();
      }

      case PGATypes.IdealLine:
      case PGATypes.Translator: {
        const translatorBuffer = new Float32Array([
          a.e01, a.e02, a.e03, 1,
        ]);

        return new TranslatorElement(translatorBuffer).normalize();
      }

      case PGATypes.OriginLine:
      case PGATypes.Rotor: {
        const rotorBuffer = new Float32Array([
          a.e23, a.e31, a.e12, (a.s + 1),
        ]);

        return new RotorElement(rotorBuffer).normalize();
      }

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }
}
