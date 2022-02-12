const ExtendableError = require('./ExtendableError');

class APIError extends ExtendableError {
  constructor({ message, errors, status = 500, isPublic = true, stack }) {
    super({ message, errors, status, isPublic, stack });
  }
}

module.exports = APIError;
