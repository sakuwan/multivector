import { isArray, set } from './util';

/*
 * Method map for forwarding proxied getters to their respective %TypedArray%
 * methods. Verbose, but faster than naive forwarding and negligibly slower
 * then directly accessing the buffer. Arguably a blacklist is smaller than
 * this whitelist, but the clarity is better.
*/
const TYPED_ARRAY_METHODS = Object.assign(Object.create(null), {
  // Functional methods
  filter: 'filter',
  forEach: 'forEach',
  map: 'map',
  reduce: 'reduce',
  reduceRight: 'reduceRight',

  // Non-mutating slicing methods
  slice: 'slice',

  // Testing, truthy, indexing methods
  every: 'every',
  find: 'find',
  findIndex: 'findIndex',
  includes: 'includes',
  indexOf: 'indexOf',
  lastIndexOf: 'lastIndexOf',
  some: 'some',

  // Mutating buffer methods (No reverse, different meaning in mathematics)
  copyWithin: 'copyWithin',
  fill: 'fill',
  set: 'set',
  sort: 'sort',

  // Special mutating copying methods, same underlying ArrayBuffer
  subarray: 'subarray',

  // Iterating, key/value, string methods
  entries: 'entries',
  join: 'join',
  keys: 'keys',
  values: 'values',
  [Symbol.iterator]: Symbol.iterator,
});

/*
 * Method for forwarding %TypedArray% methods called on ComponentVector classes
*/
const forwardArrayMethod = ({ buffer }, key) => (
  (key in TYPED_ARRAY_METHODS)
    ? (...args) => buffer[TYPED_ARRAY_METHODS[key]].call(buffer, ...args)
    : null
);

/*
 * Create a null-object map of component swizzles from a pattern mask
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
const getSwizzled = ({ buffer }, swizzle, generator) => (
  (swizzle.length === 1)
    ? buffer[swizzle[0]]
    : generator[swizzle.length](swizzle.map((_, i) => buffer[swizzle[i]]))
);

/*
 * Swizzle Proxy setter, set single component or set an array of values,
 * cycling over the provided array if its length is less than the swizzle
*/
const setSwizzled = ({ buffer }, swizzle, value) => {
  const { length } = value;
  const multipleValues = isArray(value);

  const setValues = (_, i) => {
    set(swizzle[i], multipleValues ? value[i % length] : value, buffer);
  };

  swizzle.forEach(setValues);

  return true;
};

/*
 * Create a Proxy handler with swizzle and forwarding behaviour, requires
 * a generator function to properly handle swizzled Getters
*/
const createSwizzleProxyHandler = (mask, generators) => {
  const swizzles = createSwizzleMap(mask);

  return {
    get(target, key, receiver) {
      if (key in swizzles) return getSwizzled(target, swizzles[key], generators);

      // Rename 'length' to 'size' due to conflicting meaning in mathematics
      return forwardArrayMethod(target, key) || ((key === 'size')
        ? target.buffer.length
        : Reflect.get(target, key, receiver));
    },

    set(target, key, value, receiver) {
      return (key in swizzles)
        ? setSwizzled(target, swizzles[key], value)
        : Reflect.set(target, key, value, receiver);
    },
  };
};

export default createSwizzleProxyHandler;

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
