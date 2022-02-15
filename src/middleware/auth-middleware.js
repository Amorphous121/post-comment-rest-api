const passport = require('passport');
const APIError = require('../utils/APIError');

exports.hasRole = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const err = new APIError({
        status: 403,
        message: "You don't have sufficient access to this route.",
      });
      next(err);
    }
    next();
  };
};

exports.isAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err || !user) {
      let err = new APIError({ status: 400, message: 'Invalid token' });
      return next(err);
    }
    req.user = user;
    return next();
  })(req, res, next);
};
