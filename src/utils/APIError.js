const ExtendableError = require('./ExtendableError');

/**
 * This class represents an API error.
 * @class APIError
 * @extends ExtendableError
 * @typedef {Object} APIError
 * @property {Number} status - HTTP status code of error.
 * @property {String} message - Error message.
 * @property {Object} errors - Error details.
 * @property {String} stack - Error stack trace.
 * @property {Boolean} isPublic - value denoting public error.
 */
class APIError extends ExtendableError {
  
  /**
   * @constructor APIError
   */
  constructor({
    message,
    errors = '',
    status = 500,
    isPublic = true,
    stack = '',
  }) {
    super({ message, errors, status, isPublic, stack });
  }
}

module.exports = APIError;
