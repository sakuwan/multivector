/* === PGA (3, 0, 1) vector space ===
 *
 * The PGA class provides the actual vector space operations and operators,
 * such as the inner, outer, and regressive products.
 *
 * Specific products may be called, though methods are provided to properly
 * dispatch elements to their respective implementations
*/

/* === PGA operation multimethods ===
 *
 * Multiple dispatch, or multimethods, are used to properly dispatch PGA calls
 * to their their respective implementations.
 *
 * The multimethods are constructed in './dispatch/multimethods/*'
*/
import {
  geometricMultimethod,
  innerMultimethod,
  outerMultimethod,
  regressiveMultimethod,
  sandwichMultimethod,
  dualMultimethod,
} from './dispatch/multimethods/operators';

import {
  expMultimethod,
  logMultimethod,
  sqrtMultimethod,
} from './dispatch/multimethods/functional';

export default class PGA {
  /* eslint-disable lines-between-class-members */

  /* === Core operators ===
   *
   * mul:  Geometric product  - a * b
   * dot:  Inner product      - a ∙ b
   * meet: Outer product      - a ∧ b
   * join: Regressive product - a ∨ b
   * sw:   Sandwich product   - b a b
   * dual: Dual product       - !a / *a
  */
  static mul(a, b) { return geometricMultimethod(a, b); }
  static dot(a, b) { return innerMultimethod(a, b); }
  static meet(a, b) { return outerMultimethod(a, b); }
  static join(a, b) { return regressiveMultimethod(a, b); }
  static sw(a, b) { return sandwichMultimethod(a, b); }
  static dual(a) { return dualMultimethod(a); }

  /* === Functional operations ===
   *
   * exp:  Exponentiation - e^a
   * log:  Logarithm      - log a
   * sqrt: Square root    - sqrt a
  */
  static exp(a) { return expMultimethod(a); }
  static log(a) { return logMultimethod(a); }
  static sqrt(a) { return sqrtMultimethod(a); }

  /* === Geometry operations ===
   *
   * distance: Metric distance - d(a, b)
  */

  /* eslint-enable lines-between-class-members */

  /*
  static distance(a, b) {
    // const lhsType = a.elementType;
    // const rhsType = b.elementType;

    // TODO: distances
    // d(p₁, p₂) -> meet(p₁, p₂) -> infinity norm
    // d(p, l) -> mul(p, l) -> grade(3) norm
    // d(p, P) -> meet(p, P) -> infinity norm

    // d(l, p) -> mul(l, p1) -> grade(3) norm
    // d(l₁, l₂) -> mul(l₁, l₂) -> norm
    // d(l, P) -> join(l, P) -> norm

    // d(P, p) -> meet(P, p) -> infinity norm
    // d(P, l) -> join(P, l) -> norm
    // d(P₁, P₂) -> (P₁ - P₂) -> infinity norm
  }
  */
}
