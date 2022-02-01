const userRouter = require('express').Router();
const { validate } = require('express-validation');
const { isAuth, hasRole } = require('../middleware');

const { UserController } = require('../controllers');
const { ROLE_TYPE } = require('../utils/enums');
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../validations/user.validation');

userRouter.get('/', isAuth, UserController.getAllUsers);

userRouter.get(
  '/:id',
  isAuth,
  validate(getUserById),
  UserController.getUserById
);

userRouter.post('/', validate(createUser), UserController.createUser);

userRouter.put(
  '/',
  isAuth,
  hasRole([ROLE_TYPE.USER]),
  validate(updateUser),
  UserController.updateUser
);

userRouter.delete(
  '/:id',
  isAuth,
  validate(deleteUser),
  UserController.deleteUser
);

module.exports = userRouter;
