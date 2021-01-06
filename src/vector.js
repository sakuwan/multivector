import {
  uniqueComponents,
  mapComponents,
  componentSwizzles,

  TypedArrayMethods,

  initializeBuffer,
} from './util';

export const proxifyFloatArray = (mask) => {
  const proxyGenerators = {};

  const comps = uniqueComponents(mask);
  const cmap = mapComponents(comps);
  const swizzles = componentSwizzles(comps);

  const proxyGet = (vec, swiz) => (
    (swiz.length === 1)
      ? vec[cmap[swiz[0]]]
      : proxyGenerators[swiz.length]([...swiz].map((x) => vec[cmap[x]]))
  );

  const proxySet = (vec, swiz, value) => {
    const count = value.length;
    const multi = Array.isArray(value);

    /* eslint-disable no-param-reassign */
    const setValues = (v, i) => {
      vec[cmap[v]] = multi ? value[i % count] : value;
    };
    /* eslint-enable no-param-reassign */

    [...swiz].forEach(setValues);
    return true;
  };

  const proxyHandler = {
    get(target, key, receiver) {
      if (swizzles.includes(key)) return proxyGet(target.buffer, key);

      if (key in TypedArrayMethods) {
        const arrFunction = Reflect.get(target.buffer, key, receiver);
        return (...args) => arrFunction.apply(target.buffer, args);
      }

      return Reflect.get(target, key, receiver);
    },

    set(target, key, value, receiver) {
      return swizzles.includes(key)
        ? proxySet(target.buffer, key, value)
        : Reflect.set(target, key, value, receiver);
    },
  };

  const makeProxy = (size) => (
    (...v) => new Proxy(initializeBuffer([].concat(...v), size), proxyHandler)
  );

  const mapGenerators = (a, _, i) => (
    (i > 0)
      ? Object.assign(a, { [i + 1]: makeProxy(i + 1) })
      : a
  );

  return comps.reduce(mapGenerators, proxyGenerators);
};

export const { 2: mvec2, 3: mvec3, 4: mvec4 } = proxifyFloatArray([...'xyzw']);
