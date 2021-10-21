const { User, Post, Comment } = require("../models");
const { isValidObjectId } = require("mongoose");

module.exports = {
  findAll: async (req, res) => {
    try {
      const { postId } = req.params;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: "postId가 유효하지 않습니다." });
      }
      const comments = await Comment.find({ post: postId });
      return res.status(200).json({ comments });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  createOne: async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, userId } = req.body;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: "postId가 유효하지 않습니다." });
      }
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "userId가 유효하지 않습니다." });
      }
      if (typeof content !== "string") {
        return res.status(400).json({ message: "content를 입력해야 합니다." });
      }

      const [user, post] = await Promise.all([
        User.findByIdAndUpdate(userId),
        Post.findByIdAndUpdate(postId),
      ]);
      if (!user || !post) {
        return res
          .status(400)
          .json({ message: "user 혹은 post가 존재하지 않습니다." });
      }
      if (!post.islive) {
        return res.status(400).json({ message: "비공개 post입니다." });
      }
      const comment = new Comment({ content, user, post });
      await comment.save();
      return res.status(201).json({ comment });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  updateOne: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      if (!isValidObjectId(commentId)) {
        return res
          .status(400)
          .json({ message: "commentId가 유효하지 않습니다." });
      }
      if (typeof content !== "string") {
        return res.status(400).json({ message: "content를 입력해야 합니다." });
      }

      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
      );
      return res.status(200).json({ comment });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  deleteOne: async (req, res) => {
    try {
      const { commentId } = req.params;
      if (!isValidObjectId(commentId)) {
        return res
          .status(400)
          .json({ message: "commentId가 유효하지 않습니다." });
      }

      await Comment.deleteOne({ _id: commentId });
      return res
        .status(200)
        .json({ message: "comment 삭제에 성공하였습니다." });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },
};
