/*
 * Plane ∙ Plane
 * e0 vanishes, simplifying to:
 * (p0.e1 * p1.e1) + (p0.e2 * p1.e2) + (p0.e3 * p1.e3)
*/

export const innerPlPl = (p0, p1) => {
  let result = 0;
  for (let i = 0; i < 3; i += 1) {
    result += p0[i] * p1[i];
  }

  return result;
};

/*
 * Point ∙ Point
 * All components vanish except e123, simplifying to:
 * (-p0.e123 * p1.e123)
*/
export const innerPtPt = (p0, p1) => -p0[3] * p1[3];
