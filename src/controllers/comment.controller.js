const { Comment, User, Post } = require('../models');
const { userIsAdmin } = require('../utils/helper');
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

  let query = Comment.find(
    { ...queryObject },
    '-isDeleted -deletedAt -deletedBy'
  );

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numOfRecords = await User.countDocuments();
    if (skip >= numOfRecords)
      throw new APIError({ message: "This page doesn't exists.", status: 404 });
  }
  const comments = await query;
  return res.sendJson(comments);
};

exports.getCommentById = async (req, res, next) => {
  const _id = req.params.id;
  let query = Comment.findOne({ _id }, '-isDeleted -deletedAt -deletedBy');

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  const comment = await query;
  if (!comment) {
    throw new APIError({
      status: 404,
      message: 'No such comment found with given Id',
    });
  }
  return res.sendJson(comment);
};

exports.updateComment = async (req, res, next) => {
  const _id = req.params.id;
  const payload = req.body;
  const comment = await Comment.findOneAndUpdate(
    { _id },
    { comment: payload.comment },
    { new: true }
  );
  if (!comment) {
    throw new APIError({
      status: 404,
      message: 'No such comment found with given Id',
    });
  }
  return res.sendJson(comment);
};

exports.deleteComment = async (req, res, next) => {
  const commentInfo = await Comment.findOne({ _id: req.params.id }).lean();
  if (!commentInfo) {
    throw new APIError({
      status: 404,
      message: 'No such comment found with given Id.',
    });
  }

  const postInfo = await Post.findOne({ _id: commentInfo.post }).lean();
  if (!postInfo) {
    throw new APIError({
      status: 400,
      message: 'Comment is not from a valid post.',
    });
  }

  if (
    postInfo.user === req.user._id ||
    userIsAdmin(req.user) ||
    req.user._id === commentInfo.createdBy
  ) {
    const updatePayload = {
      isDeleted: true,
      deletedBy: req.user._id,
      deletedAt: Date.now(),
    };

    const comment = await Comment.findOneAndUpdate(
      { _id: req.params._id },
      { $set: updatePayload },
      { new: true }
    );
  } else {
    throw new APIError({
      status: 403,
      message: "You are not privileged to delete other user's comments",
    });
  }
};
