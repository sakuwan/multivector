/*
 * Transform array-like values in-place, significantly reduce manual loop count
 * and barely any overhead
*/
export default function transform(fn, arr, start = 0, end = 4) {
  for (let i = start; i < end; i += 1) {
    arr[i] = fn(arr[i]); // eslint-disable-line no-param-reassign
  }
}
