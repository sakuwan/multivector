/* === Implementations === */
import { PGATypes } from '../../types';

import * as Angles from '../../math/geometry/angle';
import * as Distances from '../../math/geometry/distance';

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
  OriginLine: O,
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
  entry(p, p, (a, b) => Distances.distancePlanePlane(a, b)),
  entry(p, L, (a, b) => Distances.distancePlaneLine(a, b)),
  entry(p, P, (a, b) => Distances.distancePlanePoint(a, b)),

  /* === Lhs line element === */
  entry(L, p, (a, b) => Distances.distanceLinePlane(a, b)),
  entry(L, L, (a, b) => Distances.distanceLineLine(a, b)),
  entry(L, P, (a, b) => Distances.distanceLinePoint(a, b)),

  /* === Lhs point element === */
  entry(P, p, (a, b) => Distances.distancePointPlane(a, b)),
  entry(P, L, (a, b) => Distances.distancePointLine(a, b)),
  entry(P, P, (a, b) => Distances.distancePointPoint(a, b)),
);

/* === Angle multiple dispatch ===
 *
 * Refer to 'math/geometry/angle.js' for implementation details
 * Throws an UnsupportedError on invalid operations
*/
export const angleMultimethod = dispatch(
  false,
  () => { throw new UnsupportedError(); },

  /* === Lhs plane element === */
  entry(p, p, (a, b) => Angles.anglePlanePlane(a, b)),
  entry(p, O, (a, b) => Angles.anglePlaneOrigin(a, b)),
  entry(p, L, (a, b) => Angles.anglePlaneLine(a, b)),
  entry(p, P, (a, b) => Angles.anglePlanePoint(a, b)),

  /* === Lhs origin line element === */
  entry(O, p, (a, b) => Angles.angleOriginPlane(a, b)),
  entry(O, O, (a, b) => Angles.angleOriginOrigin(a, b)),
  entry(O, L, (a, b) => Angles.angleOriginLine(a, b)),
  entry(O, P, (a, b) => Angles.angleOriginPoint(a, b)),

  /* === Lhs line element === */
  entry(L, p, (a, b) => Angles.angleLinePlane(a, b)),
  entry(L, O, (a, b) => Angles.angleLineOrigin(a, b)),
  entry(L, L, (a, b) => Angles.angleLineLine(a, b)),
  entry(L, P, (a, b) => Angles.angleLinePoint(a, b)),

  /* === Lhs point element === */
  entry(P, p, (a, b) => Angles.anglePointPlane(a, b)),
  entry(P, O, (a, b) => Angles.anglePointOrigin(a, b)),
  entry(P, L, (a, b) => Angles.anglePointLine(a, b)),
  entry(P, P, (a, b) => Angles.anglePointPoint(a, b)),
);
