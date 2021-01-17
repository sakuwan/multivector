export default {
  Plane: Symbol('Plane'), // e0 + e1 + e2 + e3
  Line: Symbol('Line'), // (ideal) e01 + e02 + e03 + e0123, (line) e23 + e31 + e12 + s
  Point: Symbol('Point'), // e032 + e013 + e021 + e123

  Motor: Symbol('Motor'), // e23 + e31 + e12 + s + e01 + e02 + e03 + e0123
  Rotor: Symbol('Rotor'), // e23 + e31 + e12 + s
  Translator: Symbol('Translator'), // e01 + e02 + e03 + s
};
