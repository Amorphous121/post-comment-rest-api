const { User, Post, Comment } = require('../models');
const APIError = require('../utils/APIError');
const {
  removeFields,
  userIsAdmin,
  removeFieldsFromArrayOfObjects,
} = require('../utils/helper');

exports.createUser = async (req, res) => {
  
  const { email } = req.body;
  const isUserExists = await User.exists({ email });
  if (isUserExists) {
    throw new APIError({ status: 400, message: `Email is already in use.` });
  }

  const user = await User.create(req.body);
  return res.sendJson(removeFields(user.toObject(), ['password']), 201);
};

exports.getAllUsers = async (req, res, next) => {

  let queryObject = { ...req.query };

  /* Basic Filtering */
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach(el => delete queryObject[el]);

  let query = User.find({ ...queryObject })
    .populate('posts', '-isDeleted -deletedAt -__v')
    .populate('comments', '-isDeleted -deletedAt -__v');

  /* 2) Sorting */
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    console.log('sortby ==> ', sortBy)
    query = query.sort(sortBy);
  }

  /* 3) Limiting the fields ( projection ) */
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
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

  const users = await query.lean();
  return res.sendJson(
    removeFieldsFromArrayOfObjects(users, ['password'])
  );
};

exports.getUserById = async (req, res, next) => {
  const _id = req.params.id;
  let query = User.findOne(
    { _id },
    '-password, -isDeleted -deletedAt -deletedBy'
  )
    .populate({ path: 'posts', match: { isDeleted: false } })
    .populate({ path: 'comments', match: { isDeleted: false } });

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  const user = await query.lean();
  if (!user)
    throw new APIError({
      status: 404,
      message: 'No such user found with given Id.',
    });
  return res.sendJson(removeFields(user, ['password']));
};

exports.updateUser = async (req, res, next) => {
  const payload = req.body;
  const _id = req.params.id;

  if (_id !== req.user._id) {
    throw new APIError({
      status: 403,
      message: "You are not privileged to update other user's data.",
    });
  }

  if (payload.email) {
    const userInfo = await User.exists({
      _id: { $ne: _id },
      email: payload.email,
    });

    if (userInfo)
      throw new APIError({
        status: 400,
        message: 'Email is already in use by other user.',
      });
  }

  const user = await User.findOneAndUpdate({ _id }, payload, {
    new: true,
  }).lean();

  return res.sendJson(
    removeFields(user, ['password', 'posts', 'comments']),
    200
  );
};

exports.deleteUser = async (req, res, next) => {
  const _id = req.params.id;

  if (_id !== req.user._id && !userIsAdmin(req.user)) {
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

  const user = await User.findOneAndUpdate({ _id }, updateData, {
    new: true,
  }).lean();

  await Post.updateMany({ author: user._id }, updateData).lean();
  await Comment.updateMany(
    { $or: [{ createdBy: user._id }, { post: { $in: user.posts } }] },
    { $set: updateData }
  ).lean();

  return res.sendJson('User deleted successfully');
};
