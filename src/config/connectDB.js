const mongoose = require('mongoose');
const { dbUrl } = require('./appConfig');

const connectDatabase = () => mongoose.connect(dbUrl);

module.exports = connectDatabase;