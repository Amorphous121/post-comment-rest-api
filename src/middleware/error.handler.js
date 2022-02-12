const { ValidationError } = require('express-validation');
const APIError = require('../utils/APIError');

const getErrorMessage = error => {
  const errorDetails = error.details;
  if (errorDetails.params) return errorDetails.params[0].message;
  if (errorDetails.body) return errorDetails.body[0].message;
  if (errorDetails.query) return errorDetails.query[0].message;
};

exports.handler = (err, req, res, next) => {
  let message = err.message || 'Something went wrong. Please try again later.';
  if (!err.isPublic) {
    err.status = 500;
    err.message = 'Something went wrong. Please try again later.';
  }
  if (process.env.NODE_ENV === 'development') {
    console.log('\n---------------------------------------------');
    if (err.stack) console.log(err.stack);
    if (err.errors) console.log(err.errors);
    console.log('\n---------------------------------------------\n');
  }
  return res.sendJson(message, err.status);
};

exports.convertError = (err, req, res, next) => {
  let message =
    err instanceof ValidationError ? getErrorMessage(err) : err.message;
  let errObject = new APIError({
    status: err.status,
    message,
    stack: err?.stack,
  });
  return this.handler(errObject, req, res, next);
};

exports.notFoundHandler = (req, res, next) => {
  const err = new APIError({ status: 404, message: 'Not Found' });
  return this.handler(err, req, res, next);
};
