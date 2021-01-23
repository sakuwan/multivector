import { transform, reducer } from './helper';

/*
 * Plane ∙ Plane -> scalar
 * e0 vanishes, simplifying to:
 * (a.e1 * b.e1) + (a.e2 * b.e2) + (a.e3 * b.e3)
*/

export const innerPlanePlane = (a, b) => {
  const scalarLength = (acc, i) => acc + a[i] * b[i];
  return reducer(scalarLength, 0, 3);
};

/*
 * Plane ∙ Point -> Ideal line (e01, e02, e03, e0123)
 * Components are the intersections with the ideal plane, simplifying to:
 * (a.e3 * b.e013 - a.e2 * b.e021) -> e01
 * (a.e1 * b.e021 - a.e3 * b.e032) -> e02
 * (a.e2 * b.e032 - a.e1 * b.e013) -> e03
*/
export const innerPlanePointI = (a, b) => {
  const idealLine = new Float32Array(4);

  const shuffleVector = (_, i) => (
    a[(i + 2) % 3] * b[(i + 4) % 3] - a[(i + 4) % 3] * b[(i + 2) % 3]
  );
  transform(shuffleVector, idealLine, 0, 3);

  return idealLine;
};

/*
 * Plane ∙ Point -> Line through the origin
 * Components are the pure Euclidean description of direction, simplifying to:
 * (a.e1 * b.e123) -> e23
 * (a.e2 * b.e123) -> e31
 * (a.e3 * b.e123) -> e12
*/
export const innerPlanePointO = (a, b) => {
  const originLine = new Float32Array(4);

  const multiplyE0 = (_, i) => a[i] * b[3];
  transform(multiplyE0, originLine, 0, 3);

  return originLine;
};

/*
 * Point ∙ Point -> scalar
 * All components vanish except e123, simplifying to:
 * (-a.e123 * b.e123)
*/
export const innerPointPoint = (a, b) => -a[3] * b[3];
