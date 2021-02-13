/* === PGA (3, 0, 1) outer products (meet) ===
 *
*/

import { PGATypes } from './types';

/* === Plane outer products ===
 *
 * Plane ∧ Plane       -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
 * Plane ∧ Ideal line  -> Point (e032, e013, e021, 0)
 * Plane ∧ Origin line -> Point (e032, e013, e021, e123)
 * Plane ∧ Line        -> Point (e032, e013, e021, e123)
 * Plane ∧ Point       -> Pseudo-scalar
*/

/*
 * Plane ∧ Plane -> Ideal line (e01, e02, e03, 0)
 * The intersection of the subspaces spanned by two planes produces a
 * line element, the positional element extracted simplifies to:
 * (a.e0 * b.e1 - a.e1 * b.e0) -> e01
 * (a.e0 * b.e2 - a.e2 * b.e0) -> e02
 * (a.e0 * b.e3 - a.e3 * b.e0) -> e03
*/
export const outerPlanePlaneI = (a, b) => {
  const e01 = a[3] * b[0] - a[0] * b[3];
  const e02 = a[3] * b[1] - a[1] * b[3];
  const e03 = a[3] * b[2] - a[2] * b[3];

  return new Float32Array([e01, e02, e03, 0]);
};

/*
 * Plane ∧ Plane -> Origin line (e23, e31, e12, 0)
 * The intersection of the subspaces spanned by two planes produces a
 * line element, the directional element extracted simplifies to:
 * (a.e2 * b.e3 - a.e3 * b.e2) -> e23
 * (a.e3 * b.e1 - a.e1 * b.e3) -> e31
 * (a.e1 * b.e2 - a.e2 * b.e1) -> e12
*/
export const outerPlanePlaneO = (a, b) => {
  const e23 = a[1] * b[2] - a[2] * b[1];
  const e31 = a[2] * b[0] - a[0] * b[2];
  const e12 = a[0] * b[1] - a[1] * b[0];

  return new Float32Array([e23, e31, e12, 0]);
};

/*
 * Plane ∧ Plane -> Line (e01, e02, e03, 0, e23, e31, e12, 0)
 * The intersection of the subspaces spanned by two planes produces a
 * line element, the full line calculation simplifies to:
 * (a.e0 * b.e1 - a.e1 * b.e0) -> e01
 * (a.e0 * b.e2 - a.e2 * b.e0) -> e02
 * (a.e0 * b.e3 - a.e3 * b.e0) -> e03
 * (a.e2 * b.e3 - a.e3 * b.e2) -> e23
 * (a.e3 * b.e1 - a.e1 * b.e3) -> e31
 * (a.e1 * b.e2 - a.e2 * b.e1) -> e12
*/
export const outerPlanePlane = (a, b) => {
  const e01 = a[3] * b[0] - a[0] * b[3];
  const e02 = a[3] * b[1] - a[1] * b[3];
  const e03 = a[3] * b[2] - a[2] * b[3];

  const e23 = a[1] * b[2] - a[2] * b[1];
  const e31 = a[2] * b[0] - a[0] * b[2];
  const e12 = a[0] * b[1] - a[1] * b[0];

  return new Float32Array([e01, e02, e03, 0, e23, e31, e12, 0]);
};

/*
 * Plane ∧ Ideal line -> Point (e032, e013, e021, 0)
 * The intersection of a plane and an ideal line yields a positional
 * (vanishing point) point element, the directional vector calculation
 * simplifies to:
 * (a.e2 * b.e03 - a.e3 * b.e02) -> e032
 * (a.e3 * b.e01 - a.e1 * b.e03) -> e013
 * (a.e1 * b.e02 - a.e2 * b.e01) -> e021
*/
export const outerPlaneIdeal = (a, b) => {
  const e032 = a[1] * b[2] - a[2] * b[1];
  const e013 = a[2] * b[0] - a[0] * b[2];
  const e021 = a[0] * b[1] - a[1] * b[0];

  return new Float32Array([e032, e013, e021, 0]);
};

/*
 * Plane ∧ Origin line -> Point (e032, e013, e021, e123)
 * The intersection of a plane and an origin line yields a point element where
 * the homogeneous weight is an oriented orthogonal distance between the two,
 * assuming both are normalized. The calculation simplifies to:
 * -((a.e0 * b.e23)) -> e032
 * -((a.e0 * b.e31)) -> e013
 * -((a.e0 * b.e12)) -> e021
 * (a.e1 * b.e23) + (a.e2 * b.e31) + (a.e3 * b.e12) -> e123
*/
export const outerPlaneOrigin = (a, b) => {
  const e032 = -(a[3] * b[0]);
  const e013 = -(a[3] * b[1]);
  const e021 = -(a[3] * b[2]);
  const e123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e032, e013, e021, e123]);
};

/*
 * Plane ∧ Line -> Point (e032, e013, e021, e123)
 * The intersection of a plane and full line produces a point element that
 * is the full meet and common intersection of the plane and line, complete
 * with the oriented distance between the two, assuming both are normalized.
 * The calculation simplifies to:
 * (a.e2 * b.e03 - a.e3 * b.e02 - a.e0 * b.e23) -> e032
 * (a.e3 * b.e01 - a.e1 * b.e03 - a.e0 * b.e31) -> e013
 * (a.e1 * b.e02 - a.e2 * b.e01 - a.e0 * b.e12) -> e021
 * (a.e1 * b.e23) + (a.e2 * b.e31) + (a.e3 * b.e12) -> e123
*/
export const outerPlaneLine = (a, b) => {
  const e032 = a[1] * b[2] - a[2] * b[1] - a[3] * b[4];
  const e013 = a[2] * b[0] - a[0] * b[2] - a[3] * b[5];
  const e021 = a[0] * b[1] - a[1] * b[0] - a[3] * b[6];
  const e123 = a[0] * b[4] + a[1] * b[5] + a[2] * b[6];

  return new Float32Array([e032, e013, e021, e123]);
};

/*
 * Plane ∧ Point -> Pseudo-scalar
 * The meet of a plane and point determines whether or not a point lies on
 * the plane, satisfying the familiar equation of x∙n = 0, assuming both
 * elements are normalized. The calculation simplifies to:
 * (a.e1 * b.e032) + (a.e2 * b.e013) + (a.e3 * b.e021) + (a.e0 * b.e123) -> e0123
*/
export const outerPlanePoint = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
);

/* === Ideal line outer products ===
 *
 * Ideal line ∧ Plane       -> Point (e032, e013, e021, 0)
 * Ideal line ∧ Ideal line  -> Vanishes completely
 * Ideal line ∧ Origin line -> Pseudo-scalar
 * Ideal line ∧ Line        -> Pseudo-scalar
 * Ideal line ∧ Point       -> Vanishes completely
*/

/*
 * Ideal line ∧ Plane -> Point (e032, e013, e021, 0)
 * The intersection of a plane and an ideal yields a positional (vanishing point)
 * point element, the directional vector calculation simplifies to:
 * (a.e03 * b.e2 - a.e02 * b.e3) -> e032
 * (a.e01 * b.e3 - a.e03 * b.e1) -> e013
 * (a.e02 * b.e1 - a.e01 * b.e2) -> e021
*/
export const outerIdealPlane = (a, b) => {
  const e032 = a[2] * b[1] - a[1] * b[2];
  const e013 = a[0] * b[2] - a[2] * b[0];
  const e021 = a[1] * b[0] - a[0] * b[1];

  return new Float32Array([e032, e013, e021, 0]);
};

/*
 * Ideal line ∧ Origin line -> Pseudo-scalar
 * The intersection or meet of lines results in the relative chirality and
 * is a combination of spatial and angular distances, zero when the lines
 * intersect and zero when they are parallel. The calculation simplifies to:
 * (a.e01 * b.e23) + (a.e02 * b.e31) + (a.e03 * b.e12) -> e0123
*/
export const outerIdealOrigin = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/*
 * Ideal line ∧ Line -> Pseudo-scalar
 * The intersection or meet of lines results in the relative chirality and
 * is a combination of spatial and angular distances, zero when the lines
 * intersect and zero when they are parallel. The calculation simplifies to:
 * (a.e01 * b.e23) + (a.e02 * b.e31) + (a.e03 * b.e12) -> e0123
*/
export const outerIdealLine = (a, b) => (
  a[0] * b[4] + a[1] * b[5] + a[2] * b[6]
);

/* === Origin line outer products ===
 *
 * Origin line ∧ Plane       -> Point (e032, e013, e021, e123)
 * Origin line ∧ Ideal line  -> Pseudo-scalar
 * Origin line ∧ Origin line -> Vanishes completely
 * Origin line ∧ Line        -> Pseudo-scalar
 * Origin line ∧ Point       -> Vanishes completely
*/

/*
 * Origin line ∧ Plane -> Point (e032, e013, e021, e123)
 * The intersection of a plane and an origin line yields a point element where
 * the homogeneous weight is an oriented orthogonal distance between the two,
 * assuming both are normalized. The calculation simplifies to:
 * -((b.e23 * a.e0)) -> e032
 * -((b.e31 * a.e0)) -> e013
 * -((b.e12 * a.e0)) -> e021
 * (a.e23 * b.e1) + (a.e31 * b.e2) + (a.e12 * b.e3) -> e123
*/
export const outerOriginPlane = (a, b) => {
  const e032 = -(a[0] * b[3]);
  const e013 = -(a[1] * b[3]);
  const e021 = -(a[2] * b[3]);
  const e123 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  return new Float32Array([e032, e013, e021, e123]);
};

/*
 * Origin line ∧ Ideal line -> Pseudo-scalar
 * The intersection or meet of lines results in the relative chirality and
 * is a combination of spatial and angular distances, zero when the lines
 * intersect and zero when they are parallel. The calculation simplifies to:
 * (a.e23 * b.e01) + (a.e31 * b.e02) + (a.e12 * b.e03) -> e0123
*/
export const outerOriginIdeal = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/*
 * Origin line ∧ Line -> Pseudo-scalar
 * The intersection or meet of lines results in the relative chirality and
 * is a combination of spatial and angular distances, zero when the lines
 * intersect and zero when they are parallel. The calculation simplifies to:
 * (a.e23 * b.e01) + (a.e31 * b.e02) + (a.e12 * b.e03) -> e0123
*/
export const outerOriginLine = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/* === Line outer products ===
 *
 * Line ∧ Plane       -> Point (e032, e013, e021, e123)
 * Line ∧ Ideal line  -> Pseudo-scalar
 * Line ∧ Origin line -> Pseudo-scalar
 * Line ∧ Line        -> Pseudo-scalar
 * Line ∧ Point       -> Vanishes completely
*/

/*
 * Line ∧ Plane -> Point (e032, e013, e021, e123)
 * The intersection of a plane and full line produces a point element that
 * is the full meet and common intersection of the plane and line, complete
 * with the oriented distance between the two, assuming both are normalized.
 * The calculation simplifies to:
 * (a.e03 * b.e2 - a.e02 * b.e3 - a.e23 * b.e0) -> e032
 * (a.e01 * b.e3 - a.e03 * b.e1 - a.e31 * b.e0) -> e013
 * (a.e02 * b.e1 - a.e01 * b.e2 - a.e12 * b.e0) -> e021
 * (a.e23 * b.e1) + (a.e31 * b.e2) + (a.12 * b.e3) -> e123
*/
export const outerLinePlane = (a, b) => {
  const e032 = a[2] * b[1] - a[1] * b[2] - a[4] * b[3];
  const e013 = a[0] * b[2] - a[2] * b[0] - a[5] * b[3];
  const e021 = a[1] * b[0] - a[0] * b[1] - a[6] * b[3];
  const e123 = a[4] * b[0] + a[5] * b[1] + a[6] * b[2];

  return new Float32Array([e032, e013, e021, e123]);
};

/*
 * Line ∧ Ideal line -> Pseudo-scalar
 * The intersection or meet of lines results in the relative chirality and
 * is a combination of spatial and angular distances, zero when the lines
 * intersect and zero when they are parallel. The calculation simplifies to:
 * (a.e23 * b.e01) + (a.e31 * b.e02) + (a.e12 * b.e03) -> e0123
*/
export const outerLineIdeal = (a, b) => (
  a[4] * b[0] + a[5] * b[1] + a[6] * b[2]
);

/*
 * Line ∧ Origin line -> Pseudo-scalar
 * The intersection or meet of lines results in the relative chirality and
 * is a combination of spatial and angular distances, zero when the lines
 * intersect and zero when they are parallel. The calculation simplifies to:
 * (a.e01 * b.e23) + (a.e02 * b.e31) + (a.e03 * b.e12) -> e0123
*/
export const outerLineOrigin = (a, b) => (
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
);

/*
 * Line ∧ Line -> Pseudo-scalar
 * Summation of A.ideal ∧ B.origin + A.origin ∧ B.ideal
 *
 * The intersection or meet of lines results in the relative chirality and
 * is a combination of spatial and angular distances, zero when the lines
 * intersect and zero when they are parallel. The calculation simplifies to:
 * (a.e01 * b.e23) + (a.e02 * b.e31) + (a.e03 * b.e12) +
 * (a.e23 * b.e01) + (a.e31 * b.e02) + (a.e12 * b.e03) -> e0123
*/
export const outerLineLine = (a, b) => (
  a[0] * b[4] + a[1] * b[5] + a[2] * b[6] + a[4] * b[0] + a[5] * b[1] + a[6] * b[2]
);

/* === Point outer products ===
 *
 * Point ∧ Plane       -> Pseudo-scalar
 * Point ∧ Ideal line  -> Vanishes completely
 * Point ∧ Origin line -> Vanishes completely
 * Point ∧ Line        -> Vanishes completely
 * Point ∧ Point       -> Vanishes completely
*/

/*
 * Point ∧ Plane -> Pseudo-scalar
 * The meet of a point and plane determines whether or not a point lies on
 * the plane, satisfying the familiar equation of x∙n = 0, assuming both
 * elements are normalized. The calculation simplifies to:
 * -((a.e032 * b.e1) + (a.e013 * b.e2) + (a.e021 * b.e3) + (a.e123 * b.e0))
*/
export const outerPointPlane = (a, b) => (
  -(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3])
);

/* === Operation map === *
 *
 * Utility map for delegating elements to their proper outer products, coupled
 * with the result element type, intended for use in '../PGA.js'
 *
 * { [Lhs]: [Rhs] -> [Operation, Result] }
*/
export const outerProductMap = {
  [PGATypes.Plane]: {
    [PGATypes.Plane]: [outerPlanePlane, PGATypes.Line],
    [PGATypes.IdealLine]: [outerPlaneIdeal, PGATypes.Point],
    [PGATypes.OriginLine]: [outerPlaneOrigin, PGATypes.Point],
    [PGATypes.Line]: [outerPlaneLine, PGATypes.Point],
    [PGATypes.Point]: [outerPlanePoint, PGATypes.Pseudoscalar],
  },

  [PGATypes.IdealLine]: {
    [PGATypes.Plane]: [outerIdealPlane, PGATypes.Point],
    [PGATypes.OriginLine]: [outerIdealOrigin, PGATypes.Pseudoscalar],
    [PGATypes.Line]: [outerIdealLine, PGATypes.Pseudoscalar],
  },

  [PGATypes.OriginLine]: {
    [PGATypes.Plane]: [outerOriginPlane, PGATypes.Point],
    [PGATypes.IdealLine]: [outerOriginIdeal, PGATypes.Pseudoscalar],
    [PGATypes.Line]: [outerOriginLine, PGATypes.Pseudoscalar],
  },

  [PGATypes.Line]: {
    [PGATypes.Plane]: [outerLinePlane, PGATypes.Point],
    [PGATypes.IdealLine]: [outerLineIdeal, PGATypes.Pseudoscalar],
    [PGATypes.OriginLine]: [outerLineOrigin, PGATypes.Pseudoscalar],
    [PGATypes.Line]: [outerLineLine, PGATypes.Pseudoscalar],
  },

  [PGATypes.Point]: {
    [PGATypes.Plane]: [outerPointPlane, PGATypes.Pseudoscalar],
  },
};
