import { unique } from './util';
import { magnitude } from './math';

import createSwizzleProxyHandler from './swizzle';

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

    const mag = magnitude(this.buffer);
    return (type === 'number') ? mag : (mag > 0);
  },
};

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
const createVectorBuffer = (values, length) => {
  const bufferInstance = Object.create(VectorBuffer);
  bufferInstance.buffer = createFloatArray(values, length);

  return bufferInstance;
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
  const proxyHandler = createSwizzleProxyHandler(comps, proxyGenerators);

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
