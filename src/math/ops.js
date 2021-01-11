/* eslint-disable no-param-reassign */

const { sqrt } = Math;

const squaredSum = (a, c) => a + c * c;
export const magnitudeSquared = (buffer) => buffer.reduce(squaredSum, 0);
export const magnitude = (buffer) => sqrt(buffer.reduce(squaredSum, 0));

export const rcpNR1 = (buffer) => {
  const iterateNR1 = (v) => (1.0 / v) * (2 - (1.0 / v) * v);
  return buffer.map(iterateNR1);
};

export const distance = (buffer1, buffer2) => {
  const sub = (x, i) => x - buffer2[i];
  return magnitude(buffer1.map(sub));
};

export const normalize = (buffer) => {
  const mag = magnitude(buffer);

  const { length } = buffer;
  for (let i = 0; i < length; i += 1) {
    buffer[i] /= mag;
  }
};
