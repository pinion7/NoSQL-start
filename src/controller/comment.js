const { Post } = require('../models/Post');
const { User } = require('../models/User');
const { Comment } = require('../models/Comment');
const { isValidObjectId } = require('mongoose');

module.exports = {
  findAll: async (req, res) => {
    try {
      const { postId } = req.params;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: 'postId is invalid' });
      }
      const comments = await Comment.find({ post: postId });
      return res.status(200).json({ comments });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  createOne: async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, userId } = req.body;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: 'postId is invalid' });
      }
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'userId is invalid' });
      }
      if (typeof content !== 'string') {
        return res.status(400).json({ message: 'content is required' });
      }

      const [user, post] = await Promise.all([
        User.findByIdAndUpdate(userId),
        Post.findByIdAndUpdate(postId),
      ]);
      if (!user || !post) {
        return res.status(400).json({ message: 'user or post does not exist' });
      }
      if (!post.islive) {
        return res.status(400).json({ message: 'post is not available' });
      }
      const comment = new Comment({ content, user, post });
      await comment.save();
      return res.status(201).json({ comment });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  updateOne: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      if (!isValidObjectId(commentId)) {
        return res.status(400).json({ message: 'commentId is invalid' });
      }
      if (typeof content !== 'string') {
        return res.status(400).json({ message: 'content is required' });
      }

      const comment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
      return res.status(200).json({ comment });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  deleteOne: async (req, res) => {
    try {
      const { commentId } = req.params;
      if (!isValidObjectId(commentId)) {
        return res.status(400).json({ message: 'commentId is invalid' });
      }

      await Comment.deleteOne({ _id: commentId });
      return res.status(200).json({ message: 'delete success' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}