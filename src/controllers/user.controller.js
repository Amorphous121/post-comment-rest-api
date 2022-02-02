const { User, Post, Comment } = require('../models');
const APIError = require('../utils/APIError');
const { removeFields, userIsAdmin } = require('../utils/helper');

exports.createUser = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  const isUserExists = await User.exists({ email });
  if (isUserExists) {
    return res
      .status(400)
      .json({ message: `User with ${email} already exists` });
  }

  const user = await User.create(req.body);
  return res.sendJson(removeFields(user, ['password']), 201);
};

exports.getAllUsers = async (req, res, next) => {
  /* 1A) Basic Filtering */
  let queryObject = { ...req.query };
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach(el => delete queryObject[el]);

  if (queryObject.firstName) {
    queryObject.firstName = new RegExp(`${queryObject.firstName}`, 'ig');
  }

  let query = User.find(
    { ...queryObject },
    '-password, -isDeleted -deletedAt -deletedBy'
  );

  /* 2) Sorting */
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  /* 3) Limiting the fields ( projection ) */
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  /* 4) Pagination */
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numOfRecords = await User.countDocuments();
    if (skip >= numOfRecords)
      throw new APIError({ message: "This page doesn't exists.", status: 404 });
  }

  const users = await query;
  return res.sendJson(users);
};

exports.getUserById = async (req, res, next) => {
  const _id = req.params.id;
  let query = User.findOne(
    { _id },
    '-password, -isDeleted -deletedAt -deletedBy'
  );
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  const user = await query;
  if (!user)
    throw new APIError({
      status: 404,
      message: 'No such user found with given Id.',
    });
  return res.sendJson(user);
};

exports.updateUser = async (req, res, next) => {
  const payload = req.body;
  if (req.params.id !== req.user._id) {
    throw new APIError({
      status: 403,
      message: "You are not privileged to update other user's data.",
    });
  }

  const user = await User.findOneAndUpdate({ _id: req.params.id }, payload, {
    new: true,
  });
  return res.sendJson(
    removeFields(user, ['password', 'posts', 'comments']),
    200
  );
};

exports.deleteUser = async (req, res, next) => {
  if (req.params.id !== req.user._id && !userIsAdmin(req.user)) {
    throw new APIError({
      status: 403,
      message: "You are not privileged to delete other user's data.",
    });
  }

  const updateData = {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: req.user._id,
  };
  const user = await User.findOneAndUpdate({ _id: req.params.id }, updateData, {
    new: true,
  }).lean();

  await Post.updateMany({ author: user._id }, updateData).lean();
  await Comment.updateMany({ createdBy: user._id }, updateData).lean();

  return res.sendJson('User deleted successfully', 200);
};
