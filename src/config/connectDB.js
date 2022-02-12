const mongoose = require('mongoose');
const dbUrl = process.env.DATABASE_URL;

const connectDatabase = () => mongoose.connect(dbUrl);

module.exports = connectDatabase;
