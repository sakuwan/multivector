import { map } from "core-js/fn/array";

export const uniqueComponents = (mask) => [...new Set(mask)];

export const mapComponents = (mask) => mask.reduce((a, k, i) => ({ ...a, [k]: i }), {});

export const componentSwizzles = (mask) => {
  const limit = (d) => d >= mask.length - 1;
  const reducer = (fn, lead, depth) => (a, x) => [...a, ...fn(lead + x, depth)];
  const permute = (x, d) => (limit(d) ? [x] : mask.reduce(reducer(permute, x, d + 1), [x]));

  return mask.reduce(reducer(permute, '', 0), []);
};
