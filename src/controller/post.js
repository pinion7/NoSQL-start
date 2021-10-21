const { User, Post } = require("../models");
const { isValidObjectId } = require("mongoose");

module.exports = {
  findAll: async (req, res) => {
    try {
      const posts = await Post.find({})
        .limit(20)
        .populate([
          { path: "user" },
          { path: "comments", populate: { path: "user" } },
        ]);
      return res.status(200).json({ posts });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  findOne: async (req, res) => {
    try {
      const { postId } = req.params;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: "postId가 유효하지 않습니다." });
      }
      const post = await Post.findOne({ _id: postId });
      return res.status(200).json({ post });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  createPost: async (req, res) => {
    try {
      const { title, content, islive, userId } = req.body;
      if (typeof title !== "string") {
        res.status(400).json({ message: "title을 입력해야 합니다." });
      }
      if (typeof content !== "string") {
        res.status(400).json({ message: "content를 입력해야 합니다." });
      }
      if (islive && typeof islive !== "boolean") {
        res.status(400).json({ message: "islive는 불리언 값이어야 합니다." });
      }
      if (!isValidObjectId(userId)) {
        res.status(400).json({ message: "userId가 유효하지 않습니다." });
      }
      const user = await User.findById(userId);
      if (!user) {
        res.status(400).json("userId가 존재하지 않습니다.");
      }

      // user를 save한다고해서 전체를 post 콜렉션에 저장하는 게 아니라, 몽구스가 저장 가능한 것만 인식하여 저장하게 됨
      // 그래서 post 콜렉션의 user document에는 userId값만 저장이 되는 것이고
      // response 데이터에는 userId값에 해당하는 유저의 정보를 모두 포함되게 됨
      const post = new Post({ ...req.body, user: user.toObject() });
      await post.save();
      return res.status(201).json({ post });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  updateAll: async (req, res) => {
    try {
      const { postId } = req.params;
      const { title, content } = req.body;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: "postId가 유효하지 않습니다." });
      }
      if (typeof title !== "string") {
        res.status(400).json({ message: "title을 입력해야 합니다." });
      }
      if (typeof content !== "string") {
        res.status(400).json({ message: "content를 입력해야 합니다." });
      }

      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { title, content },
        { new: true }
      );
      return res.status(200).json({ post });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  updateOne: async (req, res) => {
    try {
      const { postId } = req.params;
      const { islive } = req.body;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: "postId가 유효하지 않습니다." });
      }
      if (typeof islive !== "boolean") {
        res.status(400).json({ message: "islive는 불리언 값이어야 합니다." });
      }
      const post = await Post.findByIdAndUpdate(
        postId,
        { islive },
        { new: true }
      );
      return res.status(200).json({ post });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  deleteOne: async (req, res) => {
    try {
      const { postId } = req.params;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: "postId가 유효하지 않습니다." });
      }
      await Post.deleteOne({ _id: postId });
      return res.status(200).json({ message: "post 삭제에 성공하였습니다." });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },
};
