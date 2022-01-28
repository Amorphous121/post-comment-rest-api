const express = require('express');
require('express-async-errors');
const logger = require('morgan');
require('../middleware/passport');

const indexRouter = require('../routes');
const { isNodeEnv } = require('../utils/helper');

const app = express();
const logType = isNodeEnv('production') ? 'combined' : 'dev';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger(logType));
app.use(indexRouter);

app.use((req, res, next) => {
  next(new Error('Page not found.'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

module.exports = app;