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
