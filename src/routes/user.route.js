const userRouter = require('express').Router();
const { UserController } = require('../controllers');

userRouter.post('/', UserController.createUser);

module.exports = userRouter;