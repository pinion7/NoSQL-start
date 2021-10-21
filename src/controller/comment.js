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
        User.findById(userId),
        Post.findById(postId),
      ]);
      if (!user || !post) {
        return res
          .status(400)
          .json({ message: "user 혹은 post가 존재하지 않습니다." });
      }
      if (!post.islive) {
        return res.status(400).json({ message: "비공개 post입니다." });
      }
      const comment = new Comment({ content, user: user.toObject(), post });
      await Promise.all([
        comment.save(),
        Post.updateOne({ _id: postId }, { $push: { comments: comment } }),
      ]);
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

      // comments._id, comments.$.content는 몽고db만의 문법임.
      // comments._id로 해당 id값을 선택을하고, 다음 인자로는 $를 씀으로써 해당하는 배열 인덱스에 접근 가능하게 됨
      // 아직은 생소한데, 자주 쓰며 익숙해져야할듯.
      const [comment] = await Promise.all([
        Comment.findByIdAndUpdate(commentId, { content }, { new: true }),
        Post.updateOne(
          { "comments._id": commentId },
          { "comments.$.content": content }
        ),
      ]);
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
      await Post.updateOne(
        { "comments._id": commentId },
        { $pull: { comments: { _id: commentId } } }
      );
      return res
        .status(200)
        .json({ message: "comment 삭제에 성공하였습니다." });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },
};
