/* === PGA vector space operations
 *
 * The PGA class provides the actual vector space operations and interactions
 * between elements, such as the inner, outer and regressive products.
 *
 * Specific products may be called, though methods are provided to properly
 * dispatch elements to their respective implementations
*/

import {
  geometricMultimethod,
  innerMultimethod,
  outerMultimethod,
  regressiveMultimethod,
  sandwichMultimethod,

  dualMultimethod,
  expMultimethod,
  logMultimethod,
  sqrtMultimethod,
} from './dispatch/multimethods/operators';

/* === PGA operations ===
 *
 * === Core ===
 *
 * mul:  Geometric product  - a * b
 * dot:  Inner product      - a ∙ b
 * meet: Outer product      - a ∧ b
 * join: Regressive product - a ∨ b
 * sw:   Sandwich product   - b a b
 *
 * === Functional ===
 *
 * dual: Dual operator  - !a / *a
 * exp:  Exponentiation - e^a
 * log:  Logarithm      - log a
 * sqrt: Square root    - sqrt a
 *
 * === Geometry ===
 *
 * distance: Metric distance - d(a, b)
*/
export default class PGA {
  /* eslint-disable lines-between-class-members */

  /* === Core operations === */
  static mul(a, b) { return geometricMultimethod(a, b); }
  static dot(a, b) { return innerMultimethod(a, b); }
  static meet(a, b) { return outerMultimethod(a, b); }
  static join(a, b) { return regressiveMultimethod(a, b); }
  static sw(a, b) { return sandwichMultimethod(a, b); }

  /* === Functional operations === */
  static dual(a) { return dualMultimethod(a); }
  static exp(a) { return expMultimethod(a); }
  static log(a) { return logMultimethod(a); }
  static sqrt(a) { return sqrtMultimethod(a); }

  /* eslint-enable lines-between-class-members */

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
