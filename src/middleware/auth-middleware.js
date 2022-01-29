const passport = require('passport');

exports.hasRole = (roles = []) => {
    
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'You don\'t have sufficient access to this route.' });
    }
    next();
  };
};

exports.isAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err || !user) {
      let err = new Error('invalid token');
      return next(err);
    }
    req.user = user;
    return next();
  })(req, res, next);
};
