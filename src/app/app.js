const express = require('express');
const logger = require('morgan');
const sendJson = require('../middleware/res-serializer');
require('express-async-errors');
require('../middleware');

const indexRouter = require('../routes');
const { isNodeEnv } = require('../utils/helper');

const app = express();
app.response['sendJson'] = sendJson;
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
    status: false,
    message: err.message,
  });
});

module.exports = app;