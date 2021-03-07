/* === Implementations === */
import { PGATypes } from '../../types';

import * as Dist from '../../math/geometry/distance';

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
  Plane: p,
  Line: L,
  Point: P,
} = PGATypes;

/* === Element type multiple dispatch ===
 *
 * Dispatch PGA operation calls to their proper implementation based on the
 * input types, using the multiple dispatch logic from './helpers/dispatch.js'
*/

/* === Distance multiple dispatch ===
 *
 * Refer to 'math/geometry/distance.js' for implementation details
 * Throws an UnsupportedError on invalid operations
*/
export const distanceMultimethod = dispatch(
  false,
  () => { throw new UnsupportedError(); },

  /* === Lhs plane element === */
  entry(p, p, (a, b) => Dist.distancePlanePlane(a, b)),
  entry(p, L, (a, b) => Dist.distancePlaneLine(a, b)),
  entry(p, P, (a, b) => Dist.distancePlanePoint(a, b)),

  /* === Lhs line element === */
  entry(L, p, (a, b) => Dist.distanceLinePlane(a, b)),
  entry(L, L, (a, b) => Dist.distanceLineLine(a, b)),
  entry(L, P, (a, b) => Dist.distanceLinePoint(a, b)),

  /* === Lhs point element === */
  entry(P, p, (a, b) => Dist.distancePointPlane(a, b)),
  entry(P, L, (a, b) => Dist.distancePointLine(a, b)),
  entry(P, P, (a, b) => Dist.distancePointPoint(a, b)),
);

/* === Angle multiple dispatch ===
 *
 * Refer to 'math/geometry/angle.js' for implementation details
 * Throws an UnsupportedError on invalid operations
*/
export const angleMultimethod = null;
