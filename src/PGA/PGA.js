/* === PGA vector space operations
 *
 * The PGA class provides the actual vector space operations and interactions
 * between elements, such as the inner, outer and regressive products.
 *
 * Specific products may be called, though generics are provided to properly
 * delegate elements to their respective implementations
*/

/* === Elements === */
import { MotorElement } from './elements/Motor';
import { RotorElement } from './elements/Rotor';
import { TranslatorElement } from './elements/Translator';

/* === Implementations === */
import {
  PGATypes,
} from './types';

import {
  geometricMultimethod,
  innerMultimethod,
  outerMultimethod,
  regressiveMultimethod,
  sandwichMultimethod,

  dualMultimethod,
  expMultimethod,
  logMultimethod,
} from './dispatch/multimethods/operators';

/* === PGA operations ===
 *
 * mul:  Geometric product  - a * b
 * dot:  Inner product      - a ∙ b
 * meet: Outer product      - a ∧ b
 * join: Regressive product - a ∨ b
 * sw:   Sandwich product   - b a b
 *
 * dual: Dual operator  - !a / *a
 * exp:  Exponentiation - e^x
 * log:  Logarithm      - log x
 * sqrt: Square root    - sqrt x
 *
 * distance: Metric distance - d(x, y)
*/
export default class PGA {
  /* eslint-disable lines-between-class-members */
  static mul(a, b) { return geometricMultimethod(a, b); }
  static dot(a, b) { return innerMultimethod(a, b); }
  static meet(a, b) { return outerMultimethod(a, b); }
  static join(a, b) { return regressiveMultimethod(a, b); }
  static sw(a, b) { return sandwichMultimethod(a, b); }

  static dual(a) { return dualMultimethod(a); }
  static exp(a) { return expMultimethod(a); }
  static log(a) { return logMultimethod(a); }
  /* eslint-enable lines-between-class-members */

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

  /*
  static distance(a, b) {
    // const lhsType = a.elementType;
    // const rhsType = b.elementType;

    // TODO: distances
    // d(p₁, p₂) -> meet(p₁, p₂) -> infinity norm
    // d(p, l) -> mul(p1, l) -> grade(3) norm
    // d(p, P) -> meet(p, P) -> infinity norm

    // d(l, p) -> meet(l, p1) -> grade(3) norm
    // d(l₁, l₂) -> mul(l₁, l₂) -> norm
    // d(l, P) -> join(l, P) -> norm

    // d(P, p) -> meet(P, p) -> infinity norm
    // d(P, l) -> join(P, l) -> norm
    // d(P₁, P₂) -> (P₁ - P₂) -> infinity norm
  }
  */
}
