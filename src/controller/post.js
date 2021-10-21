const { Post } = require('../models/Post');
const { User } = require('../models/User');
const { isValidObjectId } = require('mongoose');

module.exports = {
  findAll: async (req, res) => {
    try {
      const posts = await Post.find();
      return res.status(200).json({ posts });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  findOne: async (req, res) => {
    try {
      const { postId } = req.params;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: "postId is invalid" });
      }
      const post = await Post.findOne({ _id: postId });
      return res.status(200).json({ post });
    } catch (err) {
      return res.status(500).json({ message: err.message });

    }
  },

  createPost: async (req, res) => {
    try {
      const { title, content, islive, userId } = req.body;
      if (typeof title !== 'string') {
        res.status(400).json({ message: 'title is required' });
      }
      if (typeof content !== 'string') {
        res.status(400).json({ message: 'content is required' });
      }
      if (islive && typeof islive !== 'boolean') {
        res.status(400).json({ message: 'islive must be a boolean' });
      }
      if (!isValidObjectId(userId)) {
        res.status(400).json({ message: 'userId is invalid' });
      }
      const user = await User.findById(userId);
      if (!user) {
        res.status(400).json('userId is not exist');
      }

      // user를 save한다고해서 전체를 post 콜렉션에 저장하는 게 아니라, 몽구스가 저장 가능한 것만 인식하여 저장하게 됨
      // 그래서 post 콜렉션의 user document에는 userId값만 저장이 되는 것이고
      // response 데이터에는 userId값에 해당하는 유저의 정보를 모두 포함되게 됨
      const post = new Post({ ...req.body, user });
      await post.save();
      return res.status(201).json({ post });
    } catch (err) {
      return res.status(500).json({ message: err.message });

    }
  },

  updateAll: async (req, res) => {
    try {
      const { postId } = req.params;
      const { title, content } = req.body;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: 'postId is invalid' });
      }
      if (typeof title !== 'string') {
        res.status(400).json({ message: 'title is required' });
      }
      if (typeof content !== 'string') {
        res.status(400).json({ message: 'content is required' });
      }

      const post = await Post.findOneAndUpdate({ _id: postId }, { title, content }, { new: true });
      return res.status(200).json({ post });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  updateOne: async (req, res) => {
    try {
      const { postId } = req.params;
      const { islive } = req.body;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: 'postId is invalid' });
      }
      if (typeof islive !== 'boolean') {
        res.status(400).json({ message: 'islive must be a boolean' });
      }
      const post = await Post.findByIdAndUpdate(postId, { islive }, { new: true });
      return res.status(200).json({ post });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  deleteOne: async (req, res) => {
    try {
      const { postId } = req.params;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: 'postId is invalid' });
      }
      await Post.deleteOne({ _id: postId });
      return res.status(200).json({ message: 'delete success' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}