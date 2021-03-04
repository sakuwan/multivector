/*
 * A large thank you to the wonderful research and resources compiled and shared
 * by the following for furthering my interest in this aspect of math; I have
 * much to learn and greatly appreciate all the work, and look forward to more.
 *
 * Leo Dorst, Steven De Keninck, Charles Gunn, and Jeremy Ong
 * Visit bivector.net for said resources & more
*/

/* === PGA types, elements and operations ===
 *
 * PGATypes: 3,0,1 dual space PGA types
 * Elements: Valid entities of the PGA vector space
 * PGA: Operations involving elements in their respective vector space
*/
export { PGATypes } from './PGA/types';

export { Plane } from './PGA/elements/Plane';
export { IdealLine } from './PGA/elements/IdealLine';
export { OriginLine } from './PGA/elements/OriginLine';
export { Line } from './PGA/elements/Line';
export { Point } from './PGA/elements/Point';
export { Motor } from './PGA/elements/Motor';
export { Rotor } from './PGA/elements/Rotor';
export { Translator } from './PGA/elements/Translator';
export { Multivector } from './PGA/elements/Multivector';

export { default as PGA } from './PGA/PGA';

/* === Extras & helpers ===
 *
 * cvec: Swizzle-friendly wrapper over TypedArrays
*/
export {
  createVectorGenerators,

  cvec2, cvec3, cvec4,
} from './extras/vector';
