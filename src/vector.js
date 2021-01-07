/*
 * Method map for forwarding proxied getters to their respective %TypedArray%
 * methods. Verbose, but faster than naive forwarding and negligibly slower
 * then directly accessing the buffer. Arguably a blacklist is smaller than
 * this whitelist, but the clarity is better.
*/
const TYPED_ARRAY_METHODS = Object.assign(Object.create(null), {
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
 * Method for forwarding %TypedArray% methods called on VectorBuffer classes
*/
export const forwardArrayMethod = ({ buffer }, key) => (
  (key in TYPED_ARRAY_METHODS)
    ? (...args) => buffer[key].call(buffer, ...args)
    : null
);

/*
 * Create a new float array, initialized with the provided values and size,
 * will cycle the values if the provided values are less than the size, e.g.
 * ([1, 2], 3) -> [1, 2, 1]
*/
const createFloatArray = (values, size) => {
  const { length } = values;

  return (length === size)
    ? new Float32Array(values)
    : Float32Array.from({ size }, (_, i) => values[i % length]);
};

/*
 * Creates a new VectorBuffer instance, setting the primary members and
 * returning the instance, e.g.
 * (values, length) -> new VectorBuffer
*/
export const createVectorBuffer = (values, length) => {
  const bufferInstance = Object.create(VectorBuffer);

  bufferInstance.length = length;
  bufferInstance.buffer = createFloatArray(values, length);

  return bufferInstance;
};
