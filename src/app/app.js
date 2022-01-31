const express = require('express');
const logger = require('morgan');
const { sendJson, errorHandler } = require('../middleware');
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

/* Error Handling middleware stack */
app.use(errorHandler.notFoundHandler);
app.use(errorHandler.convertError);
app.use(errorHandler.handler);

module.exports = app;