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
import * as Sandwich from './impl/sandwich';

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
    const lhsType = a.elementType;
    const rhsType = b.elementType;

    const dotFn = PGA.innerMap?.[lhsType]?.[rhsType];
    if (!dotFn) throw new TypeError('Invalid arguments: Arguments are not graded PGA elements');

    return dotFn(a.buffer, b.buffer);
  }

  static outerMap = createForwardingMap(outerProductMap, '∧');

  static meet(a, b) {
    const lhsType = a.elementType;
    const rhsType = b.elementType;

    const meetFn = PGA.outerMap?.[lhsType]?.[rhsType];
    if (!meetFn) throw new TypeError('Invalid arguments: Arguments are not graded PGA elements');

    return meetFn(a.buffer, b.buffer);
  }

  static regressiveMap = createForwardingMap(regressiveProductMap, '∨');

  static join(a, b) {
    const lhsType = a.elementType;
    const rhsType = b.elementType;

    const joinFn = PGA.regressiveMap?.[lhsType]?.[rhsType];
    if (!joinFn) throw new TypeError('Invalid arguments: Arguments are not graded PGA elements');

    return joinFn(a.buffer, b.buffer);
  }

  static geometricMap = createForwardingMap(geometricProductMap, '*');

  static mul(a, b) {
    const lhsType = a.elementType;
    const rhsType = b.elementType;

    const mulFn = PGA.geometricMap?.[lhsType]?.[rhsType];
    if (!mulFn) throw new TypeError('Invalid arguments: Arguments are not graded PGA elements');

    return mulFn(a.buffer, b.buffer);
  }

  static dual({ buffer, elementType }) {
    switch (elementType) {
      case PGATypes.Plane: return new PointElement(Duality.dualPlane(buffer));
      case PGATypes.IdealLine: return new OriginElement(Duality.dualIdeal(buffer));
      case PGATypes.OriginLine: return new IdealElement(Duality.dualOrigin(buffer));
      case PGATypes.Line: return new LineElement(Duality.dualLine(buffer));
      case PGATypes.Point: return new PlaneElement(Duality.dualPoint(buffer));

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }

  static reflect(a, b) {
    const lhsType = a.elementType;
    const rhsType = b.elementType;

    if (rhsType !== PGATypes.Plane) {
      throw new TypeError('Invalid arguments: Reflection must be through a PGA plane');
    }

    switch (lhsType) {
      case PGATypes.Plane: {
        return new PlaneElement(Sandwich.sandwichPlanePlane(a.buffer, b.buffer));
      }

      case PGATypes.Line: {
        return new LineElement(Sandwich.sandwichLinePlane(a.buffer, b.buffer));
      }

      case PGATypes.Point: {
        return new PointElement(Sandwich.sandwichPointPlane(a.buffer, b.buffer));
      }

      default: throw new TypeError('Invalid arguments: Unsupported element type');
    }
  }

  static exp({ buffer, elementType }) {
    switch (elementType) {
      case PGATypes.IdealLine: {
        const [e01, e02, e03] = buffer;

        return new TranslatorElement(new Float32Array([
          e01, e02, e03, 1,
        ]));
      }

      case PGATypes.OriginLine: {
        const [e23, e31, e12, s] = buffer;

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

      /* === Complex bivector exponentiation ===
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
        const [e01, e02, e03, e0123, e23, e31, e12, s] = buffer;

        const ab = (e23 * e01 + e31 * e02 + e12 * e03);
        const aa = (e23 * e23 + e31 * e31 + e12 * e12);
        if (aa === 0) return new MotorElement(new Float32Array(8));

        const invRcp = (1.0 / aa);
        const invSqrt = invRcp ** 0.5;

        const u = aa * invSqrt;
        const v = ab * invSqrt;

        const cosu = Math.cos(u);
        const sinu = Math.sin(u);

        const e23n = e23 * invSqrt;
        const e31n = e31 * invSqrt;
        const e12n = e12 * invSqrt;
        const infinityNorm = v * invRcp;

        return new MotorElement(new Float32Array([
          (e01 * invSqrt - e23 * infinityNorm) * sinu + e23n * v * cosu,
          (e02 * invSqrt - e31 * infinityNorm) * sinu + e31n * v * cosu,
          (e03 * invSqrt - e12 * infinityNorm) * sinu + e12n * v * cosu,
          (e0123 * invSqrt - s * infinityNorm) * sinu + v * sinu,
          e23n * sinu,
          e31n * sinu,
          e12n * sinu,
          s * invSqrt * sinu + cosu,
        ]));
      }

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }

  static log({ buffer, elementType }) {
    switch (elementType) {
      /* === Complex bivector logarithm ===
       *
       * Based on the following paper:
       * "Geometric Algebra for Computer Graphics" - Charles G. Gunn
       *
       * Following the derived exponentiation, we can work backwards to reduce
       * this overdetermined system to the normalized u and v values
       * if s ≈ 0:
       *
       * u = tan⁻¹(s⁻¹, s)
       * v = p⁻¹ / s
       *
       * otherwise:
       *
       * u = tan⁻¹(-p, p⁻¹)
       * v = -p / s⁻¹
      */
      case PGATypes.Motor: {
        const [e01, e02, e03, e0123, e23, e31, e12, s] = buffer;

        const ab = (e23 * e01 + e31 * e02 + e12 * e03);
        const aa = (e23 * e23 + e31 * e31 + e12 * e12);
        if (aa === 0) {
          return new LineElement(new Float32Array([
            e01, e02, e03, e0123, 0, 0, 0, 0,
          ]));
        }

        const invRcp = (1.0 / aa);
        const invSqrt = invRcp ** 0.5;

        const invScalar = aa * invSqrt;
        const invPseudo = -(ab * invSqrt);

        const closeToZero = Math.abs(s) < 1e-6;
        const u = closeToZero ? Math.atan2(-e0123, invPseudo) : Math.atan2(invScalar, s);
        const v = closeToZero ? -e0123 / invScalar : invPseudo / s;

        const e23n = e23 * invSqrt;
        const e31n = e31 * invSqrt;
        const e12n = e12 * invSqrt;
        const infinityNorm = ab * invRcp * invSqrt;

        return new LineElement(new Float32Array([
          (e01 * invSqrt - e23 * infinityNorm) * u - e23n * v,
          (e02 * invSqrt - e31 * infinityNorm) * u - e31n * v,
          (e03 * invSqrt - e12 * infinityNorm) * u - e12n * v,
          0,
          e23n * u,
          e31n * u,
          e12n * u,
          0,
        ]));
      }

      case PGATypes.Rotor: {
        const [e23, e31, e12, s] = buffer;

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
        const [e01, e02, e03] = buffer;

        return new IdealElement(new Float32Array([
          e01, e02, e03, 0,
        ]));
      }

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }

  static sqrt({ buffer, elementType }) {
    switch (elementType) {
      case PGATypes.Motor: {
        const [e01, e02, e03, e0123, e23, e31, e12, s] = buffer;

        return new MotorElement(new Float32Array([
          e01, e02, e03, e0123,
          e23, e31, e12, s + 1,
        ])).normalize();
      }

      case PGATypes.IdealLine:
      case PGATypes.Translator: {
        const [e01, e02, e03] = buffer;

        return new TranslatorElement(new Float32Array([
          e01, e02, e03, 1,
        ])).normalize();
      }

      case PGATypes.OriginLine:
      case PGATypes.Rotor: {
        const [e23, e31, e12, s] = buffer;

        return new RotorElement(new Float32Array([
          e23, e31, e12, s + 1,
        ])).normalize();
      }

      default: throw new TypeError('Invalid argument: Unsupported element type');
    }
  }
}
