import ExtendedError from './ExtendedError';

export default class VanishingError extends ExtendedError {
  constructor(operation, message = null) {
    const errorMessage = message ?? `${operation} is a fully vanishing operation`;
    super(errorMessage);
  }
}
