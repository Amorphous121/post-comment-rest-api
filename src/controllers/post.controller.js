const { Post, User } = require('../models');

exports.createPost = async (req, res) => {
  const payload = req.body;
  const post = await Post.create({ ...payload, author: req.user._id });
  await User.findOneAndUpdate(
    { _id: req.user._id, isDeleted: false },
    { $addToSet: { posts: post._id } }
  );
  return res.sendJson(post, 201);
};
exports.getAllPosts = async (req, res) => {
  
};
exports.getPostById = async (req, res) => {};
exports.updatePost = async (req, res) => {};
exports.deletePost = async (req, res) => {};
