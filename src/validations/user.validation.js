const { Joi } = require('express-validation');
const { validateId } = require('./common.validation');

exports.createUser = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).alphanum().required(),
  }),
};

exports.getUserById = {
  params: validateId,
};

exports.updateUser = {
  params: validateId,
  body: Joi.object({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
  }),
};

exports.deleteUser = {
  params: validateId,
};
