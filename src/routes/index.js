const indexRouter = require('express').Router();

indexRouter.use('/auth', require('./auth.route'));
indexRouter.use('/user', require('./user.route'));

module.exports = indexRouter;