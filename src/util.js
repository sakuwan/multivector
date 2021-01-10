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
 * Traverse and mutate an array in-place, setting each element to fn, e.g.
 * ([1, 2, 3], fn(v, i) => v + 1) -> [2, 3, 4]
*/
export const mutate = (buffer, fn) => {
  for (let i = 0; i < buffer.length; i += 1) {
    set(i, fn(buffer[i], i), buffer);
  }

  return buffer;
};

/*
 * Simple unique filter, e.g.
 * [x, x, y, z] -> [x, y, z]
*/
export const unique = (mask) => [...new Set(mask)];
