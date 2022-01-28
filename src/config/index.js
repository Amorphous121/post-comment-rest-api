const appConfig = require('./appConfig');
const connectDatabase = require('./connectDB');

module.exports = {
  appConfig: {...appConfig},
  connectDatabase
};