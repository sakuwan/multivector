import ExtendedError from './ExtendedError';

export default class UnsupportedError extends ExtendedError {
  constructor(message = null) {
    const errorMessage = message ?? 'Unsupported element type and/or operation';
    super(errorMessage);
  }
}
