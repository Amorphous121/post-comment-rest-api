/**
 * 
 * The Extended Error class to customize errors.
 * @class ExtendableError
 * @extends Error
 * @property {string} name - The name of the constructor.
 * @property {string} message - The error message.
 * @property {Array} errors - The list of errors.
 * @property {number} status - The status code for the error.
 * @property {boolean} isPublic - The boolean flag to indicate the public error.
 * @property {Array} stack - The Stack of errors.
 */
class ExtendableError extends Error {
  /**
   * 
   * @constructor ExtendableError 
   */
  constructor({ message, errors, status, isPublic, stack }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.isPublic = isPublic;
    this.status = status;
    this.stack = stack;
  }
}

module.exports = ExtendableError;
