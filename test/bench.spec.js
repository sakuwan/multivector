/**
 * @jest-environment node
 */

/* eslint-disable */

import assert from 'assert';
import { Benchmark } from 'benchmark';

import { mvec4 } from '../src/vector';

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
});
