export const PGATypes = {
  /* === s === */
  Scalar: Symbol('Scalar'),

  /* === e1 + e2 + e3 + e0 === */
  Plane: Symbol('Plane'),

  /* === e01 + e02 + e03 + e0123 === */
  IdealLine: Symbol('IdealLine'),

  /* === e23 + e31 + e12 + s === */
  OriginLine: Symbol('OriginLine'),

  /* === e01 + e02 + e03 + e0123 + e23 + e31 + e12 + s === */
  Line: Symbol('Line'),

  /* === e032 + e013 + e021 + e123 === */
  Point: Symbol('Point'),

  /* === e0123 / I === */
  Pseudoscalar: Symbol('Pseudoscalar'),

  /* === e01 + e02 + e03 + e0123 + e23 + e31 + e12 + s === */
  Motor: Symbol('Motor'),

  /* === e23 + e31 + e12 + s === */
  Rotor: Symbol('Rotor'),

  /* === e01 + e02 + e03 + s === */
  Translator: Symbol('Translator'),

  /* === Multivector ===
   *
   * A 16-part vector composed of the following basis:
   * (s) + (e1 + e2 + e3 + e0) + (e01 + e02 + e03) +
   * (e23 + e31 + e12) + (e032 + e013 + e021 + e123) + (e0123)
  */
  Multivector: Symbol('Multivector'),
};

export const formatPGAType = (type) => {
  switch (type) {
    case PGATypes.Scalar: return 'Scalar';
    case PGATypes.Pseudoscalar: return 'Pseudoscalar';

    case PGATypes.Plane: return 'Plane';
    case PGATypes.IdealLine: return 'Ideal';
    case PGATypes.OriginLine: return 'Origin';
    case PGATypes.Line: return 'Line';
    case PGATypes.Point: return 'Point';

    case PGATypes.Motor: return 'Motor';
    case PGATypes.Rotor: return 'Rotor';
    case PGATypes.Translator: return 'Translator';

    case PGATypes.Multivector: return 'Multivector';

    default: {
      throw new TypeError(`Invalid type: ${type} is not a valid PGA type`);
    }
  }
};
