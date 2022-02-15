/**
 * @file This file manages the posts related to the user.
 * @author Prathamesh Patil
 * @copyright 01/02/2022
 * @module Post
 */

const express = require('express');
const APIError = require('../utils/APIError');
const { Post, User, Comment } = require('../models');
const {
  removeFields,
  userIsAdmin,
  removeFieldsFromArrayOfObjects,
} = require('../utils/helper');

/**
 * This function creates the post and returns the post object.
 * @function createPost
 * @param {express.Request} req Express Request Object.
 * @param {express.Response} res Express Response Object.
 * @param {express.NextFunction} next Express NextFunction Callback.
 * @returns {Promise<Object>} Post Object.
 */
exports.createPost = async (req, res, next) => {
  const payload = req.body;
  const post = await Post.create({ ...payload, author: req.user._id });
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { posts: post._id } }
  ).lean();
  return res.sendJson(removeFields(post.toObject()), 201);
};

/**
 * This function returns a list of posts created.
 * @function getAllPosts
 * @param {express.Request} req Express Request Object.
 * @param {express.Response} res Express Response Object.
 * @param {express.NextFunction} next Express NextFunction Callback.
 * @returns {Promise<Array<Object>>} List of Posts.
 */
exports.getAllPosts = async (req, res, next) => {
  const queryObject = { ...req.query };
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach(el => delete queryObject[el]);
  let query = Post.find({ ...queryObject });

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numOfRecords = await Post.countDocuments();
    if (skip >= numOfRecords)
      throw new APIError({ status: 404, message: "This page doesn't exist." });
  }
  const posts = await query.lean();
  return res.sendJson(removeFieldsFromArrayOfObjects(posts));
};

/**
 * This function returns a post object identified by the id.
 * @function getPostById
 * @param {express.Request} req Express Request Object.
 * @param {express.Response} res Express Response Object.
 * @param {express.NextFunction} next Express NextFunction Callback.
 * @returns {Promise<Object>} Post Object.
 */
exports.getPostById = async (req, res, next) => {
  const _id = req.params.id;
  let query = Post.findOne({ _id });
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }
  
  const post = await query.lean();
  if (!post)
    throw new APIError({
      status: 404,
      message: 'No such post exists with given Id.',
    });
  return res.sendJson(removeFields(post));
};

/**
 * This function updates the post identified by the id.
 * @function updatePost
 * @param {express.Request} req Express Request Object.
 * @param {express.Response} res Express Response Object.
 * @param {express.NextFunction} next Express NextFunction Callback.
 * @returns {Promise<Object>} Post Object.
 */
exports.updatePost = async (req, res, next) => {
  const isPostExists = await Post.exists({
    _id: req.params.id,
    author: req.user._id,
  });

  if (!isPostExists) 
    throw new APIError({ status: 404, message: 'No such post exists.' });

  const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  }).lean();
  return res.sendJson(removeFields(post), 200);
};

/**
 * This function deletes the given post and it's associated comments.
 * @function deletePost
 * @param {*} req Express Request Object.
 * @param {*} res Express Response Object.
 * @param {*} next Express NextFunction Callback.
 * @returns {Promise<Object>} Success Response of post deletion.
 */
exports.deletePost = async (req, res, next) => {
  const isPostExists = await Post.exists({
    _id: req.params.id,
    author: req.user._id,
  });

  if (!isPostExists && !userIsAdmin(req.user)) {
    throw new APIError({
      status: 404,
      message: 'You are not privileged to delete other posts.',
    });
  }

  const updatePayload = {
    isDeleted: true,
    deletedBy: req.user._id,
    deletedAt: new Date(),
  };
  await Comment.updateMany({ post: req.params.id }, updatePayload).lean();
  await Post.findOneAndUpdate({ _id: req.params.id }, updatePayload).lean();
  return res.sendJson('Post deleted successfully.', 200);
};
