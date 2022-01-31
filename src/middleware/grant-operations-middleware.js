const APIError = require('../utils/APIError');

exports.isUpdationAllowed = (req, res, next) => {
  if (req.params.id !== req.user._id) {
    throw new APIError({
      status: 403,
      message: 'You are not privileged to update other user\'s data.',
    });
  }
  next();
};

exports.isDeletionAllowed = (req, res, next) => {
  if (req.params.id !== req.user._id || req.user.role !== 'admin') {
    throw new APIError({
      status: 403,
      message: 'You are not privileged to delete other user\'s data.',
    });
  }
  next();
};
