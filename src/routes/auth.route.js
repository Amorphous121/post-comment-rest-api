const authRouter = require('express').Router();
const { AuthController } = require('../controllers');

authRouter.post('/login', AuthController.login);

module.exports = authRouter;
