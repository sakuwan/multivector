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

import {
  distanceMultimethod,
} from './dispatch/multimethods/geometry';

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
   * distance: Metric distance - dist(a, b)
  */
  static dist(a, b) { return distanceMultimethod(a, b); }

  /* eslint-enable lines-between-class-members */
}
