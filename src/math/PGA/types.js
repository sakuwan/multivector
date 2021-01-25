export default {
  Plane: Symbol('Plane'), // e1 + e2 + e3 + e0
  IdealLine: Symbol('IdealLine'), // e01 + e02 + e03 + e0123
  OriginLine: Symbol('OriginLine'), // e23 + e31 + e12 + s
  Line: Symbol('Line'), // (ideal) e01 + e02 + e03 + e0123, (origin) e23 + e31 + e12 + s
  Point: Symbol('Point'), // e032 + e013 + e021 + e123

  Motor: Symbol('Motor'), // e01 + e02 + e03 + e0123 + e23 + e31 + e12 + s
  Rotor: Symbol('Rotor'), // e23 + e31 + e12 + s
  Translator: Symbol('Translator'), // e01 + e02 + e03 + e0123
};
