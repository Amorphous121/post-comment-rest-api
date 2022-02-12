const postRouter = require('express').Router();
const { validate } = require('express-validation');
const { PostController } = require('../controllers');
const { isAuth, hasRole } = require('../middleware/auth-middleware');
const { ROLE_TYPE } = require('../utils/enums');
const {
  createPost,
  updatePost,
  getPostById,
  deletePost,
} = require('../validations/post.validation');

postRouter.get('/', isAuth, PostController.getAllPosts);

postRouter.get(
  '/:id',
  isAuth,
  validate(getPostById),
  PostController.getPostById
);

postRouter.post('/', isAuth, validate(createPost), PostController.createPost);

postRouter.put(
  '/:id',
  isAuth,
  hasRole([ROLE_TYPE.USER]),
  validate(updatePost),
  PostController.updatePost
);

postRouter.delete(
  '/:id',
  isAuth,
  validate(deletePost),
  PostController.deletePost
);

module.exports = postRouter;
