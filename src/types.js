export default {
  Plane: Symbol('Plane'), // e0 + e1 + e2 + e3
  Line: Symbol('Line'), // (ideal) e01 + e02 + e03 + e0123, (line) e12 + e31 + e23 + s
  Point: Symbol('Point'), // e032 + e013 + e021 + e123

  Motor: Symbol('Motor'),
  Rotor: Symbol('Rotor'),
  Translator: Symbol('Translator'),
};
