import { unique } from './util';
import {
  magnitude,
  magnitudeSquared,
  clamp,
  distance,
  normalize,

  addScalar,
  subScalar,
  mulScalar,
  divScalar,

  addVector,
  subVector,
  mulVector,
  divVector,
} from './math';

import createSwizzleProxyHandler from './swizzle';

/*
 * Vector wrapper around a float array buffer, implements helper Symbols
 * and is the object to be proxied, forwarding %TypedArray% methods to the
 * contained buffer, and should only be instantiated via 'createComponentVector'
*/
const ComponentVector = {
  buffer: null,

  /* Standard vector operations, Euclidean */
  length() {
    return magnitude(this.buffer);
  },

  lengthSquared() {
    return magnitudeSquared(this.buffer);
  },

  magnitude() {
    return magnitude(this.buffer);
  },

  magnitudeSquared() {
    return magnitudeSquared(this.buffer);
  },

  distance({ buffer }) {
    return distance(this.buffer, buffer);
  },

  normalize() {
    return normalize(this.buffer);
  },

  /* Utility vector operations */
  clamp(min, max) {
    clamp(this.buffer, min, max);
    return this;
  },

  /* Basic scalar operations */
  addS(scalar) {
    addScalar(this.buffer, scalar);
    return this;
  },

  subS(scalar) {
    subScalar(this.buffer, scalar);
    return this;
  },

  mulS(scalar) {
    mulScalar(this.buffer, scalar);
    return this;
  },

  divS(scalar) {
    divScalar(this.buffer, scalar);
    return this;
  },

  /* Basic vector operations */
  add({ buffer }) {
    addVector(this.buffer, buffer);
    return this;
  },

  sub({ buffer }) {
    subVector(this.buffer, buffer);
    return this;
  },

  mul({ buffer }) {
    mulVector(this.buffer, buffer);
    return this;
  },

  div({ buffer }) {
    divVector(this.buffer, buffer);
    return this;
  },

  /* toPrimitive, primarily for printing in string coercion */
  [Symbol.toPrimitive](type) {
    if (type === 'string') {
      const [x, y, z, w] = this.buffer;
      return `(${x}, ${y}, ${z}, ${w})`;
    }

    const mag = this.magnitude(this.buffer);
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
    : Float32Array.from({ length: size }, (_, i) => values[i % length]);
};

/*
 * Creates a new ComponentVector instance, setting the primary members and
 * returning the instance, e.g.
 * (values, length) -> new ComponentVector
*/
const createComponentVector = (values, length) => {
  const bufferInstance = Object.create(ComponentVector);
  bufferInstance.buffer = createFloatArray(values, length);

  return bufferInstance;
};

/*
 * Creates a map of functions that generate swizzle-enabled proxies over
 * ComponentVector objects. The index of the functions is equal to the length
 * of the vectors they create, not including single component vectors
 *
 * The provided pattern mask is used to generate the swizzle component map, e.g.
 * ['x', 'y', 'z', 'w'] -> { 2: fn -> xy, 3: fn -> xyz, 4: fn -> xyzw }
 *
 * The generator functions will return a proxied ComponentVector object,
 * initialized with the provided arguments or an array of values
*/
export const createVectorGenerators = (mask) => {
  const proxyGenerators = Object.create(null);

  const comps = unique(mask);
  const proxyHandler = createSwizzleProxyHandler(comps, proxyGenerators);

  const makeProxy = (size) => ({
    [size]: (...v) => new Proxy(createComponentVector([].concat(...v), size), proxyHandler),
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
  2: cvec2,
  3: cvec3,
  4: cvec4,
} = createVectorGenerators([...'xyzw']);
