const userRouter = require('express').Router();
const { isAuth, hasRole } = require('../middleware/auth-middleware');
const { UserController } = require('../controllers');
const { ROLE_TYPE } = require('../utils/enums');

userRouter.post('/', UserController.createUser);
userRouter.get(
  '/',
  isAuth,
  hasRole([ROLE_TYPE.USER]),
  UserController.getAllUsers
);



module.exports = userRouter;
