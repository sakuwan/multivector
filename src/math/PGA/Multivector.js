import {
  PGATypes,
  formatPGAType,
} from './impl/types';

import createPGAElement from './PGAElement';

/* ===  Multivector (All 3,0,1 Basis Vectors) ===
 *
 * A multivector is a representation of all basis vectors, only created through
 * certain geometric products and is not directly interactable with other
 * elements, due to being composed of many grades
 *
 * The MultivectorElement class represents a multivector, and its provided
 * methods are unary, and focused on the element itself, rather than the
 * vector space
 *
 * === Component access ===
 *
 * get / set s:     k-vector component access (0)
 * get / set e1:    k-vector component access (1)
 * get / set e2:    k-vector component access (2)
 * get / set e3:    k-vector component access (3)
 * get / set e0:    k-vector component access (4)
 * get / set e01:   k-vector component access (5)
 * get / set e02:   k-vector component access (6)
 * get / set e03:   k-vector component access (7)
 * get / set e23:   k-vector component access (8)
 * get / set e31:   k-vector component access (9)
 * get / set e12:   k-vector component access (10)
 * get / set e032:  k-vector component access (11)
 * get / set e013:  k-vector component access (12)
 * get / set e021:  k-vector component access (13)
 * get / set e123:  k-vector component access (14)
 * get / set e0123: k-vector component access (15)
 *
*/
export class MultivectorElement {
  constructor(buffer) {
    this.buffer = buffer;
    this.elementType = PGATypes.Multivector;
  }
}

createPGAElement(MultivectorElement, {
  basis: [
    's',
    'e1', 'e2', 'e3', 'e0',
    'e01', 'e02', 'e03', 'e23', 'e31', 'e12',
    'e032', 'e013', 'e021', 'e123',
    'e0123',
  ],
  name: formatPGAType(PGATypes.Multivector),

  arithmetic: false,
  grade: false,
  norm: false,
});

/* === Multivector factory ===
 *
 * () -> Multivector() -> Initialized to 0
*/
export const Multivector = () => (
  new MultivectorElement(new Float32Array(16))
);
