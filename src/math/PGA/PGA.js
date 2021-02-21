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
import { OriginElement } from './elements/OriginLine';
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

  static dual(el) {
    const { elementType } = el;
    switch (elementType) {
      case PGATypes.Plane: return new PointElement(Duality.dualPlane(el));
      case PGATypes.IdealLine: return new OriginElement(Duality.dualIdeal(el));
      case PGATypes.OriginLine: return new IdealElement(Duality.dualOrigin(el));
      case PGATypes.Line: return new LineElement(Duality.dualLine(el));
      case PGATypes.Point: return new PlaneElement(Duality.dualPoint(el));

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }

  static exp(el) {
    const { elementType } = el;

    switch (elementType) {
      case PGATypes.IdealLine: {
        const [e01, e02, e03] = el.buffer;

        return new TranslatorElement(new Float32Array([
          e01, e02, e03, 1,
        ]));
      }

      case PGATypes.OriginLine: {
        const [e23, e31, e12, s] = el.buffer;

        const theta = (e23 * e23 + e31 * e31 + e12 * e12) ** 0.5;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta) / theta;

        return new RotorElement(new Float32Array([
          e23 * sinTheta,
          e31 * sinTheta,
          e12 * sinTheta,
          s * sinTheta + cosTheta,
        ]));
      }

      /*
       * === Complex Bivector exponentiation ===
       *
       * Based on the following papers and projects:
       * "Geometric Algebra for Computer Graphics" - Charles G. Gunn
       * "A Guided Tour to the Plane-Based Geometric Algebra PGA" - Leo Dorst
       * Klein (for proofing & for their wonderful documentation) - Jeremy Ong
       *
       * The concept is based on the square root of dual numbers,
       * where sqrt(s + pI) = sqrt(s) + (p / 2 sqrt(s))I
       * ||Θ|| = u + vI = sqrt(-(Θ∙Θ + Θ∧Θ))
       *
       * Expanded for exponentiation with n being the normalized bivector,
       * e^(u + vI)n = e^(un) e^(vnI) =
       * (cos u + sin u n) + vn cos u - v sin u
      */
      case PGATypes.Line: {
        const [e01, e02, e03, e0123, e23, e31, e12, s] = el.buffer;

        const idealSq = (e23 * e01 + e31 * e02 + e12 * e03);
        const originSq = (e23 * e23 + e31 * e31 + e12 * e12);
        if (originSq === 0) return new MotorElement(new Float32Array(8));

        const invSq = (1.0 / originSq);
        const u = invSq ** 0.5;
        const v = u * invSq * idealSq;

        const cosu = Math.cos(originSq * u);
        const sinu = Math.sin(originSq * u);

        return new MotorElement(new Float32Array([
          (e01 * u - e23 * v) * sinu + (e23 * cosu * invSq * idealSq),
          (e02 * u - e31 * v) * sinu + (e31 * cosu * invSq * idealSq),
          (e03 * u - e12 * v) * sinu + (e12 * cosu * invSq * idealSq),
          (e0123 * u - s * v) * sinu + (sinu * u * idealSq),
          e23 * u * sinu,
          e31 * u * sinu,
          e12 * u * sinu,
          s * u * sinu + cosu,
        ]));
      }

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }

  static log(el) {
    const { elementType } = el;

    switch (elementType) {
      case PGATypes.Motor: {
        const [e01, e02, e03, e0123, e23, e31, e12, s] = el.buffer;

        const idealSq = (e23 * e01 + e31 * e02 + e12 * e03);
        const originSq = (e23 * e23 + e31 * e31 + e12 * e12);
        if (originSq === 0) {
          return new LineElement(new Float32Array([
            e01, e02, e03, e0123, 0, 0, 0, 0,
          ]));
        }

        const invSq = (1.0 / originSq) ** 0.5;
        const u = originSq * invSq;
        const v = -(idealSq * invSq);

        const flip = Math.abs(s) < 1e-6;
        const us = flip ? Math.atan2(-e0123, v) : Math.atan2(u, s);
        const up = flip ? -e0123 / u : v / s;

        return new LineElement(new Float32Array([
          (e01 * invSq - e23 * v) * us - (e23 * invSq * up),
          (e02 * invSq - e31 * v) * us - (e31 * invSq * up),
          (e03 * invSq - e12 * v) * us - (e12 * invSq * up),
          0,
          e23 * us * invSq,
          e31 * us * invSq,
          e12 * us * invSq,
          0,
        ]));
      }

      case PGATypes.Rotor: {
        const [e23, e31, e12, s] = el.buffer;

        const theta = Math.acos(s);
        const invTheta = (1.0 / Math.sin(theta)) * theta;

        return new OriginElement(new Float32Array([
          e23 * invTheta,
          e31 * invTheta,
          e12 * invTheta,
          0,
        ]));
      }

      case PGATypes.Translator: {
        const [e01, e02, e03] = el.buffer;

        return new IdealElement(new Float32Array([
          e01, e02, e03, 0,
        ]));
      }

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }

  static sqrt(el) {
    const { elementType } = el;

    switch (elementType) {
      case PGATypes.Motor: {
        const [e01, e02, e03, e0123, e23, e31, e12, s] = el.buffer;

        return new MotorElement(new Float32Array([
          e01, e02, e03, e0123,
          e23, e31, e12, s + 1,
        ])).normalize();
      }

      case PGATypes.IdealLine:
      case PGATypes.Translator: {
        const [e01, e02, e03] = el.buffer;

        return new TranslatorElement(new Float32Array([
          e01, e02, e03, 1,
        ])).normalize();
      }

      case PGATypes.OriginLine:
      case PGATypes.Rotor: {
        const [e23, e31, e12, s] = el.buffer;

        return new RotorElement(new Float32Array([
          e23, e31, e12, s + 1,
        ])).normalize();
      }

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }
}
