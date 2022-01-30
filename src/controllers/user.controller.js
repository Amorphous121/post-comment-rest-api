const { User } = require('../models');

exports.createUser = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email, isDeleted: false });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = await User.create(req.body);
  return res.status(201).json(newUser);
};

exports.getAllUsers = async (req, res, next) => {
  /* 1A) Basic Filtering */
  let queryObject = { ...req.query };
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach(el => delete queryObject[el]);

  if (queryObject.firstName) {
    queryObject.firstName = new RegExp(`${queryObject.firstName}`, 'ig');
  }

  let query = User.find({ ...queryObject, isDeleted: false }, { password: 0 });

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
    const numOfRecords = await User.countDocuments({ isDeleted: false });
    if (skip >= numOfRecords) throw new Error("This page doesn't exists");
  }

  const users = await query;
  return res.status(200).json(users);
};

exports.getUserById = async (req, res, next) => {
  const _id = req.params.id;
  let query = User.findOne({ _id, isDeleted: false }, { password: 0 });
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  const user = await query;
  if (!user) return res.status(400).json({ message: 'User not found' });
  return res.status(200).json(user);
};

exports.updateUser = async (req, res, next) => {

};

exports.deleteUser = async (req, res, next) => {};