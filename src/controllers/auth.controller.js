const passport = require('passport');
const { User } = require('../models');
const { issueToken } = require('../utils/helper');

exports.login = async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err || !user) {
      const error = new Error('Invalid Credentials.');
      error.status = 400;
      return next(error);
    }

    req.login(user, { session: false }, async err => {
      if (err) return next(err);
      const tokenBody = { _id: user._id, role: user.role };
      const token = await issueToken({ user: tokenBody });
      return res.status(200).json({ status: true, token: `Bearer ${token}` });
    });
  })(req, res, next);
};
