/**
 * @jest-environment node
 */

/* eslint-disable */

import assert from 'assert';
import { Benchmark } from 'benchmark';

import { mvec4 } from '../src/vector';

const eq = (...args) => {
  assert.strictEqual(args.length, 2);

  const actual = JSON.stringify(args[0]);
  const expected = JSON.stringify(args[1]);

  assert.strictEqual(actual, expected);
};

describe('benchmark', () => {
  let tableCollection = [];

  beforeEach(() => {
    tableCollection = [];
  });

  it('Construction', () => {
    new Benchmark.Suite('Construction')
    .add('multivector', () => {
      const tmpVector = mvec4([1, 2, 3, 4]);
    })
    .add('Float32Array direct', () => {
      const tmpVector = new Float32Array([1, 2, 3, 4]);
    })
    .add('Array direct', () => {
      const tmpVector = [1, 2, 3, 4];
    })
    .add('Array object instantiation', () => {
      const tmpVector = new Array([1, 2, 3, 4]);
    })
    .on('cycle', function(event) {
      tableCollection.push(String(event.target));
    })
    .on('complete', function() {
      tableCollection.push(`\nFastest is ${this.filter('fastest').map('name')}`);
      console.log(tableCollection.join('\n'));
    })
    .run({ async: false })
  });

  it('Forwarding vs buffer access', () => {
    const v1 = mvec4([1, 2, 3, 4]);
    const reducer = (a, c) => a + c;

    assert.strictEqual(v1.reduce(reducer), 10);
    assert.strictEqual(v1.buffer.reduce(reducer), 10);

    new Benchmark.Suite('Forwarding vs buffer access')
    .add('Forwarding', () => {
      v1.reduce(reducer);
    })
    .add('Buffer access', () => {
      v1.buffer.reduce(reducer);
    })
    .on('cycle', function(event) {
      tableCollection.push(String(event.target));
    })
    .on('complete', function() {
      tableCollection.push(`\nFastest is ${this.filter('fastest').map('name')}`);
      console.log(tableCollection.join('\n'));
    })
    .run({ async: false });
  });

  it('Swizzles', () =>{
    const v1 = mvec4([1, 2, 3, 4]);
    const buf = new Float32Array([1, 2, 3, 4]);

    eq(v1.xyzw.buffer, new Float32Array([1, 2, 3, 4]));
    eq(v1.xxyy.buffer, new Float32Array([1, 1, 2, 2]));

    {
      const [x, y, z, w] = buf;
      const xyzw = new Float32Array([x, y, z, w]);
      eq(xyzw, new Float32Array([1, 2, 3, 4]));
    }

    {
      const [x, y, ...rest] = buf;
      const xxyy = new Float32Array([x, x, y, y]);
      eq(xxyy, new Float32Array([1, 1, 2, 2]));
    }

    new Benchmark.Suite('Swizzles')
    .add('Unique: xyzw', () => {
      const xyzw = v1.xyzw;
    })
    .add('Repeated: xxyy', () => {
      const xxyy = v1.xxyy;
    })
    .add('Manual: xyzw', () => {
      const [x, y, z, w] = buf;
      const xyzw = new Float32Array([x, y, z, w]);
    })
    .add('Manual: xxyy', () => {
      const [x, y, ...rest] = buf;
      const xxyy = new Float32Array([x, x, y, y]);
    })
    .on('cycle', function(event) {
      tableCollection.push(String(event.target));
    })
    .on('complete', function() {
      tableCollection.push(`\nFastest is ${this.filter('fastest').map('name')}`);
      console.log(tableCollection.join('\n'));
    })
    .run({ async: false });
  });

  it('Props', () =>{
    const v1 = mvec4([1, 2, 3, 4]);
    const fl1 = new Float32Array([1, 2, 3, 4]);

    eq(v1.size, 4);
    eq(fl1.length, 4);

    new Benchmark.Suite('Props')
    .add('mv length', () => {
      const { size } = v1;
    })
    .add('f32array length', () => {
      const { length } = fl1;
    })
    .on('cycle', function(event) {
      tableCollection.push(String(event.target));
    })
    .on('complete', function() {
      tableCollection.push(`\nFastest is ${this.filter('fastest').map('name')}`);
      console.log(tableCollection.join('\n'));
    })
    .run({ async: false });
  });
});
