const { Joi } = require('express-validation');
Joi.objectId = require('joi-objectid')(Joi);

exports.validateId = Joi.object({
  id: Joi.objectId().required(),
});
