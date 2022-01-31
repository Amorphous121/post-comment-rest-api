const commentRouter = require('express').Router();
const { validate } = require('express-validation');
const { CommentController } = require('../controllers');
const { isAuth, hasRole } = require('../middleware/auth-middleware');
const { ROLE_TYPE } = require('../utils/enums');

commentRouter.get('/', isAuth, CommentController.getAllComments);
commentRouter.get('/:id', isAuth, CommentController.getCommentById);
commentRouter.post('/', isAuth, CommentController.createComment);
commentRouter.put(
  '/:id',
  isAuth,
  hasRole([ROLE_TYPE.USER]),
  CommentController.updateComment
);
commentRouter.delete('/:id', CommentController.deleteComment);

module.exports = commentRouter;
