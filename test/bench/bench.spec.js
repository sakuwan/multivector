/**
 * @jest-environment node
 */

/* eslint-disable */

import { Benchmark } from 'benchmark';
import { cvec4 } from '../../src/vector';

describe('benchmark', () => {
  let tableCollection = [];

  beforeEach(() => {
    tableCollection = [];
  });

  it('Object construction', () => {
    new Benchmark.Suite('Construction')
    .add('Construction: ComponentVector generator', () => {
      const tmpVector = cvec4(1, 2, 3, 4);
    })
    .add('Construction: new Float32Array', () => {
      const tmpVector = new Float32Array([1, 2, 3, 4]);
    })
    .add('Construction: native Array', () => {
      const tmpVector = [1, 2, 3, 4];
    })
    .add('Construction: new Array', () => {
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

  it('Forwarding vs Reflect.get %TypedArray% methods', () => {
    const v1 = cvec4(1, 2, 3, 4);
    const reducer = (a, c) => a + c;

    expect(v1.reduce(reducer)).toBe(10);
    expect(v1.buffer.reduce(reducer)).toBe(10);

    new Benchmark.Suite('%TypedArray% method access')
    .add('%TypedArray% method access: Forwarding', () => {
      v1.reduce(reducer);
    })
    .add('%TypedArray% method access: Reflect.get', () => {
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

  it('Vector component swizzling', () =>{
    const v1 = cvec4(1, 2, 3, 4);
    const buf = new Float32Array([1, 2, 3, 4]);

    expect(v1.xyzw.buffer).toEqual(new Float32Array([1, 2, 3, 4]));
    expect(v1.xxyy.buffer).toEqual(new Float32Array([1, 1, 2, 2]));

    {
      const [x, y, z, w] = buf;
      const xyzw = new Float32Array([x, y, z, w]);
      expect(xyzw).toEqual(new Float32Array([1, 2, 3, 4]));
    }

    {
      const [x, y, ...rest] = buf;
      const xxyy = new Float32Array([x, x, y, y]);
      expect(xxyy).toEqual(new Float32Array([1, 1, 2, 2]));
    }

    new Benchmark.Suite('Swizzles')
    .add('Swizzles: xyzw ComponentVector', () => {
      const xyzw = v1.xyzw;
    })
    .add('Swizzles: xxyy ComponentVector', () => {
      const xxyy = v1.xxyy;
    })
    .add('Swizzles: xyzw Float32Array destructuring', () => {
      const [x, y, z, w] = buf;
      const xyzw = new Float32Array([x, y, z, w]);
    })
    .add('Swizzles: xxyy Float32Array destructuring', () => {
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

  it('Proxy property access', () =>{
    const v1 = cvec4(1, 2, 3, 4);
    const fl1 = new Float32Array([1, 2, 3, 4]);

    expect(v1.size).toBe(4);
    expect(fl1.length).toBe(4);

    new Benchmark.Suite('Property')
    .add('Property: Proxy size', () => {
      const { size } = v1;
    })
    .add('Property: Float32Array length', () => {
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

  it('Arithmetic operations', () =>{
    const v1 = cvec4(0);

    const v2 = cvec4(0);
    const v3 = cvec4(1);
    const fl32 = new Float32Array(4);

    new Benchmark.Suite('Arithmetic')
    .add('Arithmetic: ComponentVector add scalar', () => {
      v1.addS(1);
    })
    .add('Arithmetic: ComponentVector add vector', () => {
      v2.add(v3);
    })
    .add('Arithmetic: Float32Array add loop', () => {
      for (let i = 0; i < fl32.length; i += 1) {
        fl32[i] += 1;
      }
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
