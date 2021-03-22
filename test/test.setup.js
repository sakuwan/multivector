/* === PGA element expect helpers === */
expect.extend({
  toEqualElement({ buffer }, rhs) {
    const isElement = typeof rhs === 'object' && typeof rhs.elementType === 'symbol';
    const rhsBuffer = isElement ? rhs.buffer : Float32Array.from(rhs);

    const isStrictEqual = (x, i) => x === rhsBuffer[i];
    const pass = buffer.every(isStrictEqual);
    const message = pass
      ? () => `expected [${buffer.join(', ')}] not to strictly equal [${rhsBuffer.join(', ')}]`
      : () => `expected [${buffer.join(', ')}] to strictly equal [${rhsBuffer.join(', ')}]`;

    return { message, pass };
  },

  toApproxEqualElement({ buffer }, rhs, epsilon = 1e-6) {
    const isElement = typeof rhs === 'object' && typeof rhs.elementType === 'symbol';
    const rhsBuffer = isElement ? rhs.buffer : Float32Array.from(rhs);

    const isStrictEqual = (x, i) => Math.abs(x - rhsBuffer[i]) < epsilon;
    const pass = buffer.every(isStrictEqual);
    const message = pass
      ? () => `expected [${buffer.join(', ')}] not to strictly equal [${rhsBuffer.join(', ')}]`
      : () => `expected [${buffer.join(', ')}] to strictly equal [${rhsBuffer.join(', ')}]`;

    return { message, pass };
  },
});
