/*
 * Transform array-like values in-place, significantly reduce manual loop count
 * and barely any overhead
*/
export const transform = (fn, arr, start = 0, end = 4) => {
  for (let i = start; i < end; i += 1) {
    arr[i] = fn(arr[i]); // eslint-disable-line no-param-reassign
  }
};

/*
 * Reduce with a provided fn over a specified range
*/
export const reducer = (fn, start = 0, end = 4, acc = 0) => {
  let result = acc;
  for (let i = start; i < end; i += 1) {
    result = fn(result, i);
  }

  return result;
};
