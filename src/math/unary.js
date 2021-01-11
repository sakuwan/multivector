/* eslint-disable no-param-reassign */

export const addScalar = (scalar, buffer) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) {
    buffer[i] += scalar;
  }
};

export const subScalar = (scalar, buffer) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) {
    buffer[i] -= scalar;
  }
};

export const mulScalar = (scalar, buffer) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) {
    buffer[i] *= scalar;
  }
};

export const divScalar = (scalar, buffer) => {
  const { length } = buffer;
  for (let i = 0; i < length; i += 1) {
    buffer[i] /= scalar;
  }
};
