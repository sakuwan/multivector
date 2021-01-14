/* eslint-disable no-param-reassign */

/*
 * Reciprocal with an a single Newton-Raphson iteration
*/
export const rcpNR1 = (buffer) => {
  const iterateNR1 = (v) => (1.0 / v) * (2 - (1.0 / v) * v);
  return buffer.map(iterateNR1);
};

/*
 * Vector magnitude/length, L1 & L2 (Euclidean)
*/

const absSum = (a, c) => a + Math.abs(c);
export const manhattan = (buffer) => buffer.reduce(absSum, 0);

const squaredSum = (a, c) => a + c * c;
export const magnitude = (buffer) => buffer.reduce(squaredSum, 0) ** 0.5;
export const magnitudeSquared = (buffer) => buffer.reduce(squaredSum, 0);

/*
 * Distance between two vectors
*/
export const distance = (buffer, other) => {
  const sub = (x, i) => x - other[i];
  return magnitude(buffer.map(sub));
};

/*
 * Normalize a vector to unit length (1), maintaining direction
*/
export const normalize = (buffer) => {
  const mag = (1.0 / magnitude(buffer));

  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] *= mag;
};

/*
 * Dot product between two vectors
*/
export const dot = (buffer, other) => {
  const dist = (a, c, i) => a + (c * other[i]);
  return buffer.reduce(dist, 0);
};

/*
 * Compare two vectors with strict equality
*/
export const equals = (buffer, other) => {
  const equal = (v, i) => v === other[i];
  return buffer.every(equal);
};

/*
 * Compare two vectors with approximate equality
*/
export const approxEq = (buffer, other, precision = 2) => {
  const equal = (v, i) => Math.abs(other[i] - v) < (10 ** -precision) / 2;
  return buffer.every(equal);
};

/*
 * Linearly interpolate between two vectors
*/
export const lerp = (buffer, other, delta) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] += (other[i] - buffer[i]) * delta;
};

/*
 * Set a vector's components to the min between itself and another
*/
export const min = (buffer, other) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] = Math.min(buffer[i], other[i]);
};

/*
 * Set a vector's components to the max between itself and another
*/
export const max = (buffer, other) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] = Math.max(buffer[i], other[i]);
};

/*
 * Clamp a vector to certain ranges
*/
export const clamp = (buffer, vmin, vmax) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] = Math.max(vmin, Math.min(vmax, buffer[i]));
};

/*
 * Round a vector's components up to the next integer
*/
export const ceil = (buffer) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] = Math.ceil(buffer[i]);
};

/*
 * Round a vector's components down to a less or equal integer
*/
export const floor = (buffer) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] = Math.floor(buffer[i]);
};

/*
 * Round a vector's components depending on the fractional portion of each
*/
export const round = (buffer) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] = Math.round(buffer[i]);
};

/*
 * Negate a vector
*/
export const negate = (buffer) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] = -buffer[i];
};
