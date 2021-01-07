import { isArray, set, unique } from './util';
import { createVectorBuffer, forwardArrayMethod } from './vector';

/*
 * Map a pattern mask to their component indexes, e.g.
 * [x, y, z, w] -> { x: 0, y: 1, z: 2, w: 3 }
*/

/* Previous implementation, depreciated
const mapComponents = (mask) => {
  const reducer = (a, key, i) => ({ ...a, [key]: i });
  return mask.reduce(reducer, {});
};
*/

/*
 * Build a array of valid component swizzles from a pattern mask, e.g.
 * [x, y] -> [x, xx, xy, y, yy, yx]
 * Recursive approach, simply reduce each component and cycle the mask
*/

/* Previous implementation, depreciated
const componentSwizzles = (mask) => {
  const limit = (d) => d >= mask.length - 1;
  const reducer = (fn, lead, d) => (a, x) => [...a, ...fn(lead + x, d)];
  const permute = (x, d) => (limit(d) ? [x] : mask.reduce(reducer(permute, x, d + 1), [x]));

  return mask.reduce(reducer(permute, '', 0), []);
};
*/

/*
 * Same as above, except returning a null-prototype object as a map
 * with key-value pairs that are valid swizzles and their indices, e.g.
 * [x, y] -> { x: [0], xx: [0, 0], xy: [0, 1], y: [1], yy: [1, 1], yx: [1, 0] }
 * Potentially faster, 'key in obj' is quicker than [].includes
*/
const createSwizzleMap = (mask) => {
  const checkDepth = (depth) => depth >= mask.length - 1;
  const makeIndices = (a, key) => [...a, mask.indexOf(key)];

  const makePermutes = (fn, prev, depth) => (a, key) => {
    const curr = prev + key;
    const indices = [...curr].reduce(makeIndices, []);

    return Object.assign(set(curr, indices, a), fn(curr, depth));
  };

  const permute = (key, depth) => (
    checkDepth(depth) ? {} : mask.reduce(makePermutes(permute, key, depth + 1), {})
  );

  return mask.reduce(makePermutes(permute, '', 0), Object.create(null));
};

/*
 * Swizzle Proxy getter, return single component or generate a new swizzled
 * vector with the desired components with the provided generator
*/
const proxyGet = ({ buffer }, swizzle, generator) => (
  (swizzle.length === 1)
    ? buffer[swizzle[0]]
    : generator[swizzle.length](swizzle.map((_, i) => buffer[swizzle[i]]))
);

/*
 * Swizzle Proxy setter, set single component or set an array of values,
 * cycling over the provided array if its length is less than the swizzle
*/
const proxySet = ({ buffer }, swizzle, value) => {
  const { length } = value;
  const multipleValues = isArray(value);

  const setValues = (_, i) => {
    set(swizzle[i], multipleValues ? value[i % length] : value, buffer);
  };

  swizzle.forEach(setValues);
  return true;
};

/*
 * Creates a map of functions that generate swizzle-enabled proxies over
 * VectorBuffer objects. The index of the functions is equal to the length
 * of the vectors they create, not including single component vectors
 *
 * The provided pattern mask is used to generate the swizzle component map, e.g.
 * ['x', 'y', 'z', 'w'] -> { 2: fn -> xy, 3: fn -> xyz, 4: fn -> xyzw }
 *
 * The generator functions will return a proxied VectorBuffer object,
 * initialized with the provided arguments or an array of values
*/
export const createVectorGenerators = (mask) => {
  const proxyGenerators = Object.create(null);

  const comps = unique(mask);
  const swizzles = createSwizzleMap(comps);

  const proxyHandler = {
    get(target, key, receiver) {
      if (key in swizzles) {
        return proxyGet(target, swizzles[key], proxyGenerators);
      }

      return forwardArrayMethod(target, key) || Reflect.get(target, key, receiver);
    },

    set(target, key, value, receiver) {
      return (key in swizzles)
        ? proxySet(target, swizzles[key], value)
        : Reflect.set(target, key, value, receiver);
    },
  };

  const makeProxy = (size) => ({
    [size]: (...v) => new Proxy(createVectorBuffer([].concat(...v), size), proxyHandler),
  });

  const makeGenerators = (a, _, i) => (
    (i > 0)
      ? Object.assign(a, makeProxy(i + 1))
      : a
  );

  return comps.reduce(makeGenerators, proxyGenerators);
};

/*
 * [size]: <GeneratorName>
*/
export const {
  2: mvec2,
  3: mvec3,
  4: mvec4,
} = createVectorGenerators([...'xyzw']);
