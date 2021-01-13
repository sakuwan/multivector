/* eslint-disable no-param-reassign */

/*
 * General scalar operations over any array-like
*/
export const addScalar = (buffer, scalar) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] += scalar; // add
};

export const subScalar = (buffer, scalar) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] -= scalar; // sub
};

export const mulScalar = (buffer, scalar) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] *= scalar; // mul
};

export const divScalar = (buffer, scalar) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] *= (1.0 / scalar); // div
};

/*
 * General vector operations over an array-like
*/
export const addVector = (buffer, other) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] += other[i]; // add
};

export const subVector = (buffer, other) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] -= other[i]; // sub
};

export const mulVector = (buffer, other) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] *= other[i]; // mul
};

export const divVector = (buffer, other) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) buffer[i] *= (1.0 / other[i]); // div
};
