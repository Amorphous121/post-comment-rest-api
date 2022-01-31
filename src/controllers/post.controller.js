const { Post, User } = require('../models');
const APIError = require('../utils/APIError');
const { removeFields } = require('../utils/helper');

exports.createPost = async (req, res) => {
  const payload = req.body;
  const post = await Post.create({ ...payload, author: req.user._id });
  await User.findOneAndUpdate(
    { _id: req.user._id, isDeleted: false },
    { $addToSet: { posts: post._id } }
  );
  return res.sendJson(removeFields(post), 201);
};
exports.getAllPosts = async (req, res, next) => {
  const queryObject = { ...req.query };
  /* Basic Filtering */
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach(el => delete queryObject[el]);

  let query = Post.find(
    { ...queryObject, isDeleted: false },
    '-isDeleted -deletedAt -deletedBy'
  );

  /* Sorting */
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  /* Limiting the fields */
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  /* Pagination */
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numOfRecords = await Post.countDocuments({ isDeleted: false });
    if (skip >= numOfRecords)
      throw new APIError({ status: 404, message: "This page doesn't exist." });
  }
  const posts = await query;
  return res.sendJson(posts);
};

exports.getPostById = async (req, res, next) => {
  const _id = req.params._id;
  let query = Post.findOne(
    { _id, isDeleted: false },
    '-isDeleted -deletedAt -deletedBy'
  );
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }
  const post = await query;
  if (!post)
    throw new APIError({
      status: 404,
      message: 'No such post exists with given Id.',
    });
  return res.sendJson(post);
};
exports.updatePost = async (req, res, next) => {};
exports.deletePost = async (req, res, next) => {};
