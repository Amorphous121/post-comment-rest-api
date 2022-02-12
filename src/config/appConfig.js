require('dotenv').config();

const appConfig = {
  port: process.env.SERVER_PORT || 8000,
  dbUrl: process.env.DATABASE_URL,
  jwtTokenSecret: process.env.JWT_TOKEN_SECRET,
  bcryptRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
};

module.exports = appConfig;
