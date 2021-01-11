/*
 * Simple isArray shortcut
*/
export const { isArray } = Array;

/*
 * Simple unique filter, e.g.
 * [x, x, y, z] -> [x, y, z]
*/
export const unique = (mask) => [...new Set(mask)];

/* eslint-disable no-return-assign, no-param-reassign, no-sequences */
/*
 * Simple single prop set & self return, sugar over (xs[key] = v, xs)
*/
export const set = (key, v, xs) => (xs[key] = v, xs);
/* eslint-enable no-return-assign, no-param-reassign, no-sequences */
