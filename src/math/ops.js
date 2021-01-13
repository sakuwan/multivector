/* eslint-disable no-param-reassign */

/*
 * Vector magnitude/length, Euclidean
*/
const squaredSum = (a, c) => a + c * c;
export const magnitude = (buffer) => buffer.reduce(squaredSum, 0) ** 0.5;
export const magnitudeSquared = (buffer) => buffer.reduce(squaredSum, 0);

export const rcpNR1 = (buffer) => {
  const iterateNR1 = (v) => (1.0 / v) * (2 - (1.0 / v) * v);
  return buffer.map(iterateNR1);
};

/*
 * Clamp a vector to certain ranges
*/
export const clamp = (buffer, min, max) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] = Math.max(min, Math.min(max, buffer[i]));
};

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
