import ExtendedError from './ExtendedError';

export default class InvalidElement extends ExtendedError {
  constructor(message = null) {
    const errorMessage = message ?? 'Provided elements are not valid PGA elements';
    super(errorMessage);
  }
}
