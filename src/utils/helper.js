/**
 * @module helper
 */
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { appConfig } = require('../config');

exports.isNodeEnv = env => env === process.env.NODE_ENV;

exports.issueToken = data => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      appConfig.jwtTokenSecret,
      { expiresIn: '7d', algorithm: 'HS512' },
      (err, token) => {
        if (err) throw new Error(err);
        return resolve(token);
      }
    );
  });
};

exports.removeFields = (object, keys = [], defaultFields = true) => {
  const basicFields = ['deletedAt', 'deletedBy', 'isDeleted', '__v'];
  keys = typeof keys === 'string' ? [keys] : keys || [];
  if (defaultFields) keys = keys.concat(basicFields);
  return _.omit(object, keys);
};

exports.removeFieldsFromArrayOfObjects = (
  array = [],
  keys = [],
  defaultFields = true
) => {
  return array.map(item => this.removeFields(item, keys, defaultFields));
};

exports.userIsAdmin = user => user.role === 'admin';
