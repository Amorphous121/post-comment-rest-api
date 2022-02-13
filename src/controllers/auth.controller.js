const passport = require('passport');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { issueToken } = require('../utils/helper');
const APIError = require('../utils/APIError');
const { appConfig } = require('../config');

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
        return res.sendJson({ token: `Bearer ${token}` });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const userInfo = await User.findOne({ email }).lean();

  if (!userInfo)
    throw new APIError({ status: 400, message: 'user not found.' });

  // User exists create reset password token
  let secret = appConfig.jwtTokenSecret + userInfo.password;
  const payload = {
    email: userInfo.email,
    _id: userInfo._id,
  };
  const token = JWT.sign(payload, secret, { expiresIn: '1h' });
  return res.sendJson({ resetToken: token, _id: userInfo._id });
};

exports.resetPassword = async (req, res, next) => {
  const { id, resetToken, password, confirmPassword } = req.body;

  const user = await User.findById(id).lean();

  const secret = appConfig.jwtTokenSecret + user.password;
  const {_id, email} = JWT.verify(resetToken, secret);

  if (id !== _id)
    throw new APIError({ status: 400, message: 'Invalid token.' });

  if (password !== confirmPassword)
    throw new APIError({ status: 400, message: 'password not match.' });

  const userInfo = await User.findOne({ _id, email }).lean();

  if (!userInfo) {
    throw new APIError({ status: 400, message: 'user not found.' });
  }

  const hashPassword = await bcrypt.hash(password, appConfig.bcryptRounds);
  await User.findOneAndUpdate({ _id, email }, { password: hashPassword });
  return res.sendJson({ message: 'password reset successfully.' });
};
