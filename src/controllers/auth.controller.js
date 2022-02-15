/**
 * @file This file Manages Authentication part of application.
 * @author Prathamesh Patil
 * @copyright 01/02/2022
 * @module Auth
 */

const bcrypt = require('bcrypt');
const express = require('express');
const JWT = require('jsonwebtoken');
const passport = require('passport');
const { User } = require('../models');
const { appConfig } = require('../config');
const APIError = require('../utils/APIError');
const { issueToken } = require('../utils/helper');

/**
 * Generates Jwt token on valid credentials.
 * @function login
 * @param { express.Request } req Express Request Object.
 * @param { express.Response } res Express Response Object.
 * @param { express.NextFunction } next Express NextFunction Callback.
 * @returns { (Promise<Object> | Error) } Success response with Jwt Token.
 */
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

/**
 * Generates a resetPasswordToken required for Resetting Password
 * @function forgotPassword
 * @param { express.Request } req Express Request Object.
 * @param { express.Response } res Express Response Object.
 * @param { express.NextFunction } next Express NextFunction Callback.
 * @returns { (Promise<Object> | Error) } ResetPasswordToken.
 */
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const userInfo = await User.findOne({ email }).lean();

  if (!userInfo)
    throw new APIError({ status: 400, message: 'user not found.' });

  // User exists then sign reset password token
  let secret = appConfig.jwtTokenSecret + userInfo.password;
  const payload = {
    email: userInfo.email,
    _id: userInfo._id,
  };
  const token = JWT.sign(payload, secret, { expiresIn: '1h' });
  return res.sendJson({ resetToken: token, _id: userInfo._id });
};

/**
 * Resets the password of user to given valid password.
 * @function resetPassword
 * @param { express.Request } req Express Request Object.
 * @param { express.Response } res Express Response Object.
 * @param { express.NextFunction } next Express NextFunction Callback.
 * @returns { (Promise<Object> | Error) } Success message of password reset.
 */
exports.resetPassword = async (req, res, next) => {
  const { id, resetToken, password, confirmPassword } = req.body;
  const user = await User.findById(id).lean();

  const secret = appConfig.jwtTokenSecret + user.password;
  const { _id, email } = JWT.verify(resetToken, secret);

  if (id !== _id) 
    throw new APIError({ status: 400, message: 'Invalid token.' });

  if (password !== confirmPassword) 
    throw new APIError({ status: 400, message: 'password not match.' });

  const userInfo = await User.findOne({ _id, email }).lean();
  if (!userInfo) 
    throw new APIError({ status: 400, message: 'user not found.' });

  const hashPassword = await bcrypt.hash(password, appConfig.bcryptRounds);
  await User.findOneAndUpdate({ _id, email }, { password: hashPassword });
  return res.sendJson({ message: 'password reset successfully.' });
};
