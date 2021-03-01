import ComponentVector from './ComponentVector';
import createSwizzleProxyHandler from './swizzle';

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
const createComponentVector = (values, length) => (
  new ComponentVector(createFloatArray(values, length))
);

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

  const comps = [...new Set(mask)];
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
