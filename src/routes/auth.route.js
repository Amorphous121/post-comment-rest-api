const { validate } = require('express-validation');
const authRouter = require('express').Router();
const { AuthController } = require('../controllers');
const { login, forgotPassword, resetPassword } = require('../validations/auth.validation');

authRouter.post('/login', validate(login), AuthController.login);
authRouter.post('/forgotPassword', validate(forgotPassword), AuthController.forgotPassword);
authRouter.post('/resetPassword', validate(resetPassword), AuthController.resetPassword);

module.exports = authRouter;
