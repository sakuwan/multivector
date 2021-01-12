import { cvec2, cvec3, cvec4 } from '../../src/vector';

describe('ComponentVector', () => {
  it('Properly initializes from provided values', () => {
    const v1 = cvec2([1, 2]);
    expect(v1.size).toBe(2);
    expect(v1.buffer).toEqual(new Float32Array([1, 2]));

    const v2 = cvec3([1, 2, 3]);
    expect(v2.size).toBe(3);
    expect(v2.buffer).toEqual(new Float32Array([1, 2, 3]));

    const v3 = cvec4([1, 2, 3, 4]);
    expect(v3.size).toBe(4);
    expect(v3.buffer).toEqual(new Float32Array([1, 2, 3, 4]));
  });

  it('Cycles values when length is larger than provided values', () => {
    const v1 = cvec2(1);
    expect(v1.size).toBe(2);
    expect(v1.buffer).toEqual(new Float32Array([1, 1]));

    const v2 = cvec3([1, 2]);
    expect(v2.size).toBe(3);
    expect(v2.buffer).toEqual(new Float32Array([1, 2, 1]));

    const v3 = cvec4(-1, 5);
    expect(v3.size).toBe(4);
    expect(v3.buffer).toEqual(new Float32Array([-1, 5, -1, 5]));
  });

  it('Swizzle getters return proper components and ComponentVectors', () => {
    const v1 = cvec4(1, 2, 3, 4);

    const v2 = v1.xyz;
    expect(v2.buffer).toEqual(new Float32Array([1, 2, 3]));

    const v3 = v2.xxx;
    expect(v3.buffer).toEqual(new Float32Array([1, 1, 1]));

    const v4 = v1.wzyx;
    expect(v4.buffer).toEqual(new Float32Array([4, 3, 2, 1]));

    const { x } = v4;
    expect(x).toBe(4);
  });

  it('Swizzle getters are separate instances and hold no references', () => {
    const v1 = cvec4(1, 2, 3, 4);

    const v2 = v1.xyz;
    expect(v2.buffer).toEqual(new Float32Array([1, 2, 3]));

    v2.fill(0);
    expect(v2.buffer).toEqual(new Float32Array([0, 0, 0]));
    expect(v1.buffer).toEqual(new Float32Array([1, 2, 3, 4]));

    const v3 = v1.xyz;
    expect(v2.buffer).not.toBe(v3.buffer);
  });

  it('Swizzle setters assign proper values', () => {
    const v1 = cvec4(1, 2, 3, 4);

    v1.x = 5;
    expect(v1.buffer).toEqual(new Float32Array([5, 2, 3, 4]));

    v1.xxx = 1;
    expect(v1.buffer).toEqual(new Float32Array([1, 2, 3, 4]));

    v1.xyz = [-1, -2, -3];
    expect(v1.buffer).toEqual(new Float32Array([-1, -2, -3, 4]));

    v1.xyzw = [5, 4];
    expect(v1.buffer).toEqual(new Float32Array([5, 4, 5, 4]));
  });

  it('Forwards most desired %TypedArray% methods: Functional', () => {
    const v1 = cvec4(1, 2, 3, 4);

    const filtered = v1.filter((x) => x % 2 === 0);
    expect(filtered).toBeInstanceOf(Float32Array);
    expect(filtered).toEqual(new Float32Array([2, 4]));

    const plusOne = [];
    v1.forEach((x) => plusOne.push(x + 1));
    expect(plusOne).toEqual([2, 3, 4, 5]);

    const minusOne = v1.map((x) => x - 1);
    expect(minusOne).toBeInstanceOf(Float32Array);
    expect(minusOne).toEqual(new Float32Array([0, 1, 2, 3]));

    const sum = v1.reduce((a, c) => a + c);
    expect(sum).toBe(10);

    const sumRight = v1.reduceRight((a, c) => a + c);
    expect(sumRight).toBe(10);
  });

  it('Forwards most desired %TypedArray% methods: Non-mutating slicing', () => {
    const v1 = cvec4(1, 2, 3, 4);

    const sliced = v1.slice(1, 3);
    expect(sliced).toBeInstanceOf(Float32Array);
    expect(sliced).toEqual(new Float32Array([2, 3]));
  });

  it('Forwards most desired %TypedArray% methods: Testing, truthy, indexing', () => {
    const v1 = cvec4(1, 2, 3, 4);

    const aboveZero = v1.every((x) => x > 0);
    expect(aboveZero).toBe(true);

    const equalToOne = v1.every((x) => x === 1);
    expect(equalToOne).toBe(false);

    const multipleThree = v1.find((x) => x % 3 === 0);
    expect(multipleThree).toBe(3);

    const multipleThreeIndex = v1.findIndex((x) => x % 3 === 0);
    expect(multipleThreeIndex).toBe(2);

    const hasTwo = v1.includes(2);
    expect(hasTwo).toBe(true);

    const hasTwoOffset = v1.includes(2, 3);
    expect(hasTwoOffset).toBe(false);

    const oneIndex = v1.indexOf(1);
    expect(oneIndex).toBe(0);
    const oneIndexOffset = v1.indexOf(1, 1);
    expect(oneIndexOffset).toBe(-1);

    const twoIndex = v1.lastIndexOf(2);
    expect(twoIndex).toBe(1);
    const twoIndexOffset = v1.lastIndexOf(2, 0);
    expect(twoIndexOffset).toBe(-1);

    const hasMultipleTwo = v1.some((x) => x % 2 === 0);
    expect(hasMultipleTwo).toBe(true);

    const greaterThanFive = v1.some((x) => x > 5);
    expect(greaterThanFive).toBe(false);
  });

  it('Forwards most desired %TypedArray% methods: Mutating buffer methods', () => {
    const v1 = cvec4(1, 2, 3, 4);

    v1.copyWithin(2, 0, 2);
    expect(v1.buffer).toEqual(new Float32Array([1, 2, 1, 2]));

    v1.fill(0);
    expect(v1.buffer).toEqual(new Float32Array(4));

    v1.fill(2, 2, 3);
    expect(v1.buffer).toEqual(new Float32Array([0, 0, 2, 0]));

    v1.set([1, 2]);
    expect(v1.buffer).toEqual(new Float32Array([1, 2, 2, 0]));

    v1.set([3, 4], 2);
    expect(v1.buffer).toEqual(new Float32Array([1, 2, 3, 4]));

    v1.sort((a, b) => a + b);
    expect(v1.buffer).toEqual(new Float32Array([4, 3, 2, 1]));

    v1.sort((a, b) => a - b);
    expect(v1.buffer).toEqual(new Float32Array([1, 2, 3, 4]));
  });

  it('Forwards most desired %TypedArray% methods: Special mutating copying', () => {
    const v1 = cvec4(1, 2, 3, 4);

    const fl32View = v1.subarray(0, 4);
    expect(fl32View).toEqual(new Float32Array([1, 2, 3, 4]));

    fl32View.set([0, 0]);
    expect(fl32View).toEqual(new Float32Array([0, 0, 3, 4]));
    expect(v1.buffer).toEqual(new Float32Array([0, 0, 3, 4]));
  });

  it('Forwards most desired %TypedArray% methods: Iterating, key/value, string', () => {
    const v1 = cvec4(1, 2, 3, 4);

    const entryIterator = v1.entries();
    expect(entryIterator.next().value).toEqual([0, 1]);

    entryIterator.next();
    entryIterator.next();
    expect(entryIterator.next().value).toEqual([3, 4]);

    const commaJoin = v1.join(',');
    expect(commaJoin).toBe('1,2,3,4');

    const commaSpacedJoin = v1.join(', ');
    expect(commaSpacedJoin).toBe('1, 2, 3, 4');

    const keyIterator = v1.keys();
    expect(keyIterator.next().value).toBe(0);

    keyIterator.next();
    keyIterator.next();
    expect(keyIterator.next().value).toBe(3);

    const valueIterator = v1.values();
    expect(valueIterator.next().value).toBe(1);

    valueIterator.next();
    valueIterator.next();
    expect(valueIterator.next().value).toBe(4);

    const symbolValueIterator = v1[Symbol.iterator]();
    expect(symbolValueIterator.next().value).toBe(1);

    symbolValueIterator.next();
    symbolValueIterator.next();
    expect(symbolValueIterator.next().value).toBe(4);
  });

  it('Performs general case n-Vector methods', () => {
    const v1 = cvec4(1, 2, 3, 4);

    v1.add(5);
    expect(v1.buffer).toEqual(new Float32Array([6, 7, 8, 9]));

    v1.sub(5);
    expect(v1.buffer).toEqual(new Float32Array([1, 2, 3, 4]));

    v1.mul(2);
    expect(v1.buffer).toEqual(new Float32Array([2, 4, 6, 8]));

    v1.div(2);
    expect(v1.buffer).toEqual(new Float32Array([1, 2, 3, 4]));

    const mag2 = v1.magnitudeSquared();
    expect(mag2).toBe(30);

    const mag = v1.magnitude();
    expect(mag).toBe(Math.sqrt(mag2));
    expect(mag).toBeCloseTo(5.47722557, 5);

    const len2 = v1.lengthSquared();
    expect(len2).toBe(mag2);

    const len = v1.length();
    expect(len).toBe(mag);

    const v2 = cvec4(5, 2, 3, 4);
    const dist = v1.distance(v2);
    expect(dist).toBe(4);

    v2.x = 1;
    const dist2 = v1.distance(v2);
    expect(dist2).toBe(0);

    v1.normalize();
    expect(v1.buffer).toEqual(new Float32Array([1 / len, 2 / len, 3 / len, 4 / len]));
  });
});
