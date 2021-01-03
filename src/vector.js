import { uniqueComponents, mapComponents, componentSwizzles } from './util';

const proxifyFloatArray = (mask) => {
  const proxyGenerators = [];

  const comps = uniqueComponents(mask);
  const cmap = mapComponents(comps);
  const swizzles = componentSwizzles(comps);

  const proxyGet = (vec, swiz, map) => (
    (swiz.length === 1)
      ? vec[map[swiz[0]]]
      : proxyGenerators[swiz.length - 2](swiz.map((x) => vec[map[x]]))
  );

  const proxySet = (vec, swiz, map, value) => {
    const count = value.length - 1;
    const multi = Array.isArray(value);
    swiz.forEach((x, i) => {
      if (multi && i < count) {
        vec[map[x]] = value[i]; // eslint-disable-line no-param-reassign
      } else if (!multi) {
        vec[map[x]] = value; // eslint-disable-line no-param-reassign
      }
    });

    return true;
  };
};
