export default class ExtendedError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
