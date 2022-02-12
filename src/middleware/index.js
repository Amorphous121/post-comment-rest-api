const { isAuth, hasRole } = require('./auth-middleware');
const passportConfig = require('./passport');
const errorHandler = require('./error.handler');
const sendJson = require('./res-serializer');

module.exports = {
  isAuth,
  hasRole,
  sendJson,
  errorHandler,
  passportConfig,
};
