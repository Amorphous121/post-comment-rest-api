const passport = require('passport');
const { issueToken } = require('../utils/helper');
const APIError = require('../utils/APIError');

exports.login = async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if (err || !user) {
        throw new APIError({ status: 400, message: 'Invalid Credentials.' });
      }

      req.login(user, { session: false }, async err => {
        if (err) return next(err);
        const tokenBody = { _id: user._id, role: user.role };
        const token = await issueToken({ user: tokenBody });
        return res.status(200).json({ status: true, token: `Bearer ${token}` });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};
