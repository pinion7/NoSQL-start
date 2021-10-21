const express = require('express');
const commentRouter = express.Router({ mergeParams: true });
const commentController = require('../controller/comment');

commentRouter.get('/', commentController.findAll);
commentRouter.post('/', commentController.createOne);
commentRouter.patch('/:commentId', commentController.updateOne);
commentRouter.delete('/:commentId', commentController.deleteOne);

module.exports = {
  commentRouter
}