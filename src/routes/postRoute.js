const express = require('express');
const postRouter = express.Router();
const postController = require('../controller/post');

postRouter.get('/', postController.findAll);
postRouter.get('/:postId', postController.findOne);
postRouter.post('/', postController.createPost);
postRouter.put('/:postId', postController.updateAll)
postRouter.patch('/:postId/live', postController.updateOne);
postRouter.delete('/:postId', postController.deleteOne);

module.exports = {
  postRouter
}