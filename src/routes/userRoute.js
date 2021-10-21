const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/user');

userRouter.get('/', userController.findAll);
userRouter.get('/:userId', userController.findOne);
userRouter.post('/', userController.createOne);
userRouter.put('/:userId', userController.updateAll);
userRouter.delete('/:userId', userController.deleteOne);

module.exports = {
  userRouter
}