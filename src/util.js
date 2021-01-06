/*
 * Simple unique mask filter, e.g.
 * [x, x, y, z] -> [x, y, z]
*/
export const uniqueComponents = (mask) => [...new Set(mask)];

/*
 * Map a pattern mask to their component indexes, e.g.
 * [x, y, z, w] -> { x: 0, y: 1, z: 2, w: 3 }
*/
export const mapComponents = (mask) => {
  const reducer = (a, key, i) => ({ ...a, [key]: i });
  return mask.reduce(reducer, {});
};

/*
 * Build a array of valid component swizzles from a pattern mask, e.g.
 * [x, y] -> [x, xx, xy, y, yy, yx]
 * Recursive approach, simply reduce each component and cycle the mask
*/
export const componentSwizzles = (mask) => {
  const limit = (d) => d >= mask.length - 1;
  const reducer = (fn, lead, d) => (a, x) => [...a, ...fn(lead + x, d)];
  const permute = (x, d) => (limit(d) ? [x] : mask.reduce(reducer(permute, x, d + 1), [x]));

  return mask.reduce(reducer(permute, '', 0), []);
};

/*
 * Same as above, except returning a null-prototype object as a map instead
 * [x, y] -> { x: null, xx: null, xy: null, y: null, yy: null, yx: null }
 * Potentially faster, 'key in obj' is quicker than [].includes
*/
export const mapSwizzles = (mask) => {
  const limit = (depth) => depth >= mask.length - 1;
  /* eslint-disable no-return-assign, no-param-reassign */
  const reducer = (fn, prev, depth) => (a, key) => (
    Object.assign((a[prev + key] = null, a), fn(prev + key, depth))
  );
  /* eslint-enable no-return-assign, no-param-reassign */
  const permute = (key, depth) => (
    limit(depth) ? {} : mask.reduce(reducer(permute, key, depth + 1), {})
  );

  return mask.reduce(reducer(permute, '', 0), Object.create(null));
};

/*
 * Method map for forwarding proxied getters to their respective %TypedArray%
 * methods. Verbose, but faster than naive forwarding and negligibly slower
 * then directly accessing the buffer. Arguably a blacklist is smaller than
 * this whitelist, but the clarity is better.
*/
export const TypedArrayMethods = Object.assign(Object.create(null), {
  // Functional methods
  filter: true,
  forEach: true,
  map: true,
  reduce: true,
  reduceRight: true,

  // Non-mutating slicing methods
  slice: true,
  subarray: true,

  // Testing, truthy, indexing methods
  every: true,
  find: true,
  findIndex: true,
  includes: true,
  indexOf: true,
  lastIndexOf: true,
  some: true,

  // Mutating buffer methods
  copyWithin: true,
  fill: true,
  reverse: true,
  set: true,
  sort: true,

  // Iterating, key/value and string methods
  entries: true,
  join: true,
  keys: true,
  values: true,
  [Symbol.iterator]: true,
});

/*
 * Create a new float array, initialized with the provided values and length,
 * will cycle the values if the provided values are less than the length, e.g.
 * ([1, 2], 3) -> [1, 2, 1]
*/
const initializeFloatArray = (values, length) => {
  const count = values.length;

  return (count === length)
    ? new Float32Array(values)
    : Float32Array.from({ length }, (_, i) => values[i % count]);
};

/*
 * Vector wrapper around a float array buffer, implements helper Symbols
 * and is the object to be proxied, forwarding %TypedArray% methods to the
 * contained buffer, and should only be instantiated via 'initializeBuffer'
*/
const VectorBuffer = {
  buffer: null,

  [Symbol.toPrimitive](type) {
    if (type === 'string') {
      const [x, y, z, w] = this.buffer;
      return `(${x}, ${y}, ${z}, ${w})`;
    }

    const sqsum = (a, c) => a + c * c;
    const length = Math.sqrt(this.buffer.reduce(sqsum, 0));

    return (type === 'number') ? length : (length > 0);
  },
};

/*
 * Creates a new VectorBuffer instance, setting the primary members and
 * returning the instance, e.g.
 * (values, length) -> new VectorBuffer
*/
export const initializeBuffer = (values, length) => {
  const bufferInstance = Object.create(VectorBuffer);

  bufferInstance.length = length;
  bufferInstance.buffer = initializeFloatArray(values, length);

  return bufferInstance;
};
