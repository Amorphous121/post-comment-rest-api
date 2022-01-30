const userRouter = require('express').Router();
const { validate } = require('express-validation');
const { isAuth, hasRole } = require('../middleware/auth-middleware');
const { UserController } = require('../controllers');
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../validations/user.validation');
const { ROLE_TYPE } = require('../utils/enums');

userRouter.get(
  '/',
  isAuth,
  hasRole([ROLE_TYPE.USER, ROLE_TYPE.ADMIN]),
  UserController.getAllUsers
);

userRouter.get(
  '/:id',
  isAuth,
  hasRole([ROLE_TYPE.USER, ROLE_TYPE.ADMIN]),
  validate(getUserById),
  UserController.getUserById
);

userRouter.post('/', validate(createUser), UserController.createUser);

userRouter.put(
  '/',
  isAuth,
  hasRole([ROLE_TYPE.ADMIN]),
  validate(updateUser),
  UserController.updateUser
);

userRouter.delete(
  '/:id',
  isAuth,
  hasRole([ROLE_TYPE.ADMIN]),
  validate(deleteUser),
  UserController.deleteUser
);

module.exports = userRouter;