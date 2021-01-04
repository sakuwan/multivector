export const uniqueComponents = (mask) => [...new Set(mask)];

export const mapComponents = (mask) => mask.reduce((a, k, i) => ({ ...a, [k]: i }), {});

export const componentSwizzles = (mask) => {
  const limit = (d) => d >= mask.length - 1;
  const reducer = (fn, lead, d) => (a, x) => [...a, ...fn(lead + x, d)];
  const permute = (x, d) => (limit(d) ? [x] : mask.reduce(reducer(permute, x, d + 1), [x]));

  return mask.reduce(reducer(permute, '', 0), []);
};

export const initializeFloatArray = (values, len) => {
  const count = values.length;

  return (count === len)
    ? new Float32Array(values)
    : Float32Array.from({ length: len }, (_, i) => values[i % count]);
};

// TODO: Actual TypedArray function wrappers