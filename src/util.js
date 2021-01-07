/*
 * Simple isArray shortcut
*/
export const { isArray } = Array;

/*
 * Simple single prop set & self return, sugar over (xs[key] = v, xs)
*/
export const set = (key, v, xs) => {
  xs[key] = v; // eslint-disable-line no-param-reassign
  return xs;
};

/*
 * Simple unique filter, e.g.
 * [x, x, y, z] -> [x, y, z]
*/
export const unique = (mask) => [...new Set(mask)];
