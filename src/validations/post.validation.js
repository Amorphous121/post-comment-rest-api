const { Joi } = require('express-validation');
const { validateId } = require('./common.validation');

exports.createPost = {
  body: Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().min(3).required(),
  }),
};

exports.getPostById = {
  params: validateId,
};

exports.updatePost = {
  params: validateId,
  body: Joi.object({
    title: Joi.string().min(3),
    content: Joi.string().min(3),
  })
    .required()
    .not({}),
};

exports.deletePost = {
  params: validateId,
};
