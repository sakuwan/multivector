import { set } from '../util';

const sqsum = (a, c) => a + c * c;

const rcpNR1 = (buffer) => {
  const iterateNR1 = (v) => {
    const rcp = 1.0 / v;
    return rcp * (2 - rcp * v);
  };

  return buffer.map(iterateNR1);
};

export const magnitudeSquared = (buffer) => buffer.reduce(sqsum, 0);
export const magnitude = (buffer) => Math.sqrt(magnitudeSquared(buffer));

export const normalize = (buffer) => {
  const rcp = rcpNR1(buffer);
  const norm = (v, i, a) => set(i, rcp[i] * v, a);

  buffer.forEach(norm);
};

export const normalize2 = (buffer) => {
  const norm = (v, i, a) => set(i, ((1.0 / v) * (2 - (1.0 / v) * v)) * v, a);

  buffer.forEach(norm);
};

export const normalize3 = (buffer) => {
  const norm = (v, i, a) => {
    const rcp = (1.0 / v);
    set(i, (rcp * (2 - rcp * v)) * v, a);
  };

  buffer.forEach(norm);
};

export const reverse = (grades, buffer) => {
  const flip = (v, i, a) => set(i, (grades[i] === 2 || grades[i] === 3) ? -v : v, a);
  buffer.forEach(flip);
};
