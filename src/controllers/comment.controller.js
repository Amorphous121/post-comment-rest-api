const { Comment, User, Post } = require('../models');
const APIError = require('../utils/APIError');

exports.createComment = async (req, res, next) => {
  const payload = req.body;
  const isPostExists = await Post.exists({
    _id: payload.post,
  });
  if (!isPostExists)
    throw new APIError({ status: 400, message: 'No such post exits.' });
  const comment = await Comment.create({
    comment: payload.comment,
    createdBy: req.user._id,
    post: payload.post,
  });
  await Post.findOneAndUpdate(
    { _id: payload.post },
    { $addToSet: { comments: comment._id } }
  );
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { comments: comment._id } }
  );
  return res.sendJson(comment, 201);
};

exports.getAllComments = async (req, res, next) => {
  const queryObject = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObject[el]);

  let query = Comment.find({ ...queryObject });
};
exports.getCommentById = async (req, res, next) => {};
exports.updateComment = async (req, res, next) => {};
exports.deleteComment = async (req, res, next) => {};
