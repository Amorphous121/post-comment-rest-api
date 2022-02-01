const { Joi } = require('express-validation');
const { validateId } = require('./common.validation');
Joi.objectId = require('joi-objectid')(Joi);

exports.createComment = {
  body: Joi.object({
    post: Joi.objectId().required(),
    comment: Joi.string().required(),
  }),
};

exports.getCommentById = {
  params: validateId,
};

exports.updateComment = {
  params: validateId,
  body: Joi.object({
    comment: Joi.string(),
  })
    .required()
    .not({}),
};

exports.deleteComment = {
  params: validateId,
};
