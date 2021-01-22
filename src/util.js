/*
 * isArray shortcut
*/
export const { isArray } = Array;

/*
 * Unique property filter, e.g.
 * [x, x, y, z] -> [x, y, z]
*/
export const unique = (mask) => [...new Set(mask)];

/* eslint-disable no-return-assign, no-param-reassign, no-sequences */
/*
 * Single prop set & self return, for mutating in-place
*/
export const set = (key, v, xs) => (xs[key] = v, xs);
/* eslint-enable no-return-assign, no-param-reassign, no-sequences */
