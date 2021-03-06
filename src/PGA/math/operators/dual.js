/* === PGA (3, 0, 1) Poincare Duality ===
 *
 * Defined by J : P(G) -> P(G*), it is an invertible, grade-reversing map
 * for the unique x in the exterior algebra, such that ∧^k -> ∧^(n + 1 - k)
 *
 * Plane       -> (<G> - <p>)  -> (4 - 1) -> Point
 * Ideal line  -> (<G> - <l∞>) -> (4 - 2) -> Origin line
 * Origin line -> (<G> - <lₒ>) -> (4 - 2) -> Ideal line
 * Line        -> (<G> - <ℓ>)  -> (4 - 2) -> Line (Ideal line and Origin line swapped)
 * Point       -> (<G> - <P>)  -> (4 - 3) -> Plane
 *
 * As this isn't Typescript or any superset with actual types, this is quite
 * redundant as the buffers are already always "dualized." Nevertheless, it
 * has some use for Line elements, but the rest are essentially no-ops and is
 * merely here for the sake of the concept
*/

/*
 * Simply clone the buffer as-is, since there is no change in the mapping
*/
export const dualPlane = (a) => new Float32Array(a);
export const dualIdeal = (a) => new Float32Array(a);
export const dualOrigin = (a) => new Float32Array(a);

/*
 * Swap the order of the Ideal and Origin line elements
*/
export const dualLine = (a) => {
  const [e01, e02, e03, e0123, e23, e31, e12, s] = a;
  return new Float32Array([e23, e31, e12, s, e01, e02, e03, e0123]);
};

/*
 * Simply clone the buffer as-is, since there is no change in the mapping
*/
export const dualPoint = (a) => new Float32Array(a);
