require('dotenv').config();
const { isNodeEnv } = require('../utils/helper');

const appConfig = {
  port: process.env.SERVER_PORT || 8000,
  dbUrl: process.env.DATABASE_URL,
  jwtTokenSecret: process.env.BCRYPT_ROUNDS,
  bcryptRounds: process.env.BCRYPT_SALT_ROUNDS || 10,
};

module.exports = appConfig;