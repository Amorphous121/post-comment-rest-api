const { Joi } = require('express-validation');
Joi.objectId = require('joi-objectid')(Joi);

exports.login = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).required(),
  }),
};

exports.forgotPassword = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
  }),
};

exports.resetPassword = {
  body: Joi.object({
    id: Joi.objectId().required(),
    resetToken: Joi.string().required(),
    password: Joi.string().min(4).max(15).trim().required(),
    confirmPassword: Joi.ref('password'),
  }),
};
