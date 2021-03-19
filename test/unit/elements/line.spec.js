import {
  Line,
} from '../../../src';

describe('PGA Element - Line', () => {
  it('Initializes a proper element', () => {
    // Export is a light factory wrapper around new
    expect(typeof Line).toBe('function');

    // Default line, Line(0, 0, 0, 0, 0, 0)
    const defaultLine = Line();
    expect(defaultLine.buffer).toEqual(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]));

    // Initialize with values
    const initializedLine = Line(1, 2, 3, 4, 5, 6);
    expect(initializedLine.buffer).toEqual(new Float32Array([1, 2, 3, 0, 4, 5, 6, 0]));
  });
});
