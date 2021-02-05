/* === PGA -- Projective vector space operations
 *
 * The PGA class provides the actual vector space operations and interactions
 * between elements, such as the inner, outer and regressive products.
 *
 * Specific products may be called, though generics are provided to properly
 * delegate elements to their respective implementations
*/

/* === Types === */
import PGATypes from './types';

/* === Elements === */
import {
  PlaneElement,
} from './Plane';

import {
  IdealElement,
} from './IdealLine';

import {
  OriginElement,
} from './OriginLine';

import {
  LineElement,
} from './Line';

import {
  PointElement,
} from './Point';

/* === Implementations === */
import * as IP from './impl/inner';
import * as OP from './impl/outer';
import * as RP from './impl/regressive';

import * as Duality from './impl/dual';

/* === Element type delegation maps ===
 *
 * Create the maps that will forward calls to their respective implementations.
*/

const createForwardingMap = (prefix, impl) => {
  const symbolTypes = {
    Plane: PGATypes.Plane,
    Ideal: PGATypes.IdealLine,
    Origin: PGATypes.OriginLine,
    Line: PGATypes.Line,
    Point: PGATypes.Point,
  };

  const fetchValidFunction = (a, b) => {
    const funcName = `${prefix}${a}${b}`;
    const errorMessage = `Invalid arguments: ${funcName} is a fully vanishing operation`;

    return (funcName in impl)
      ? impl[funcName]
      : () => { throw new TypeError(errorMessage); };
  };

  const makeImplMap = (el) => (a, c) => ({
    ...a, [symbolTypes[c]]: fetchValidFunction(el, c),
  });

  const makeElementMaps = (a, c, _, arr) => ({
    ...a, [symbolTypes[c]]: arr.reduce(makeImplMap(c), {}),
  });

  return Object.keys(symbolTypes).reduce(makeElementMaps, {});
};

export default class PGA {
  static innerMap = createForwardingMap('inner', IP);

  static dot(a, b) {
    const lhsType = a.type();
    const rhsType = b.type();

    return PGA.innerMap[lhsType][rhsType](a.buffer, b.buffer);
  }

  static outerMap = createForwardingMap('outer', OP);

  static meet(a, b) {
    const lhsType = a.type();
    const rhsType = b.type();

    return PGA.outerMap[lhsType][rhsType](a.buffer, b.buffer);
  }

  static regressiveMap = createForwardingMap('regressive', RP);

  static join(a, b) {
    const lhsType = a.type();
    const rhsType = b.type();

    return PGA.regressiveMap[lhsType][rhsType](a.buffer, b.buffer);
  }

  static dual(a) {
    const { elementType } = a;
    switch (elementType) {
      case PGATypes.Plane: return new PointElement(Duality.dualPlane(a));
      case PGATypes.IdealLine: return new OriginElement(Duality.dualIdeal(a));
      case PGATypes.OriginLine: return new IdealElement(Duality.dualOrigin(a));
      case PGATypes.Line: return new LineElement(Duality.dualLine(a));
      case PGATypes.Point: return new PlaneElement(Duality.dualPoint(a));

      default: throw new TypeError('[PGA.dual] Invalid argument: Unsupported element type');
    }
  }
}
