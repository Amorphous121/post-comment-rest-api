const { Joi } = require('express-validation');
const { validateId } = require('./common.validation');

exports.createUser = {
  body: Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).required(),
  }),
};

exports.getUserById = {
  params: validateId,
};

exports.updateUser = {
  params: validateId,
  body: Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    email: Joi.string().lowercase().email(),
  })
    .required()
    .not({}),
};

exports.deleteUser = {
  params: validateId,
};
