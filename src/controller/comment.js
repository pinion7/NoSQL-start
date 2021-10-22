const { User, Post, Comment } = require("../models");
const { isValidObjectId, startSession } = require("mongoose");

module.exports = {
  findAll: async (req, res) => {
    try {
      const { page } = req.query;
      const { postId } = req.params;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({ message: "postId가 유효하지 않습니다." });
      }
      if (page) {
        const comments = await Comment.find({ post: postId })
          .sort({ createdAt: -1 })
          .skip(parseInt(page) * 3)
          .limit(3);
        return res.status(200).json({ comments });
      }
      const comments = await Comment.find({ post: postId });
      return res.status(200).json({ comments });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  createOne: async (req, res) => {
    const session = await startSession();
    let comment;
    try {
      await session.withTransaction(async () => {
        const { postId } = req.params;
        const { content, userId } = req.body;
        if (!isValidObjectId(postId)) {
          return res
            .status(400)
            .json({ message: "postId가 유효하지 않습니다." });
        }
        if (!isValidObjectId(userId)) {
          return res
            .status(400)
            .json({ message: "userId가 유효하지 않습니다." });
        }
        if (typeof content !== "string") {
          return res
            .status(400)
            .json({ message: "content를 입력해야 합니다." });
        }

        const [user, post] = await Promise.all([
          User.findById(userId, {}, { session }),
          Post.findById(postId, {}, { session }),
        ]);
        if (!user || !post) {
          return res
            .status(400)
            .json({ message: "user 혹은 post가 존재하지 않습니다." });
        }
        if (!post.islive) {
          return res.status(400).json({ message: "비공개 post입니다." });
        }
        comment = new Comment({
          content,
          user: user.toObject(),
          post: postId,
        });

        // post에 모든 댓글을 내장하는 게 아닐, 댓글이 추가될때마다 오래된 댓글은 제거해서 post에 내장하는 방법
        // 장점: 최신댓글만 볼 수 있고, comment에는 모든 게 다 저장되기 때문에 원하면 페이지네이션을 통해 다음 코멘트 확인 가능
        ++post.commentsCount;
        post.comments.push(comment);
        if (post.commentsCount > 3) {
          post.comments.shift();
        }
        await Promise.all([
          comment.save({ session }),
          post.save(),
          // Post.updateOne(
          //   { _id: postId },
          //   { $push: { comments: comment }, $inc: { commentsCount: 1 } }
          // ),
        ]);

        //
      });
      // ※ 참고사항
      // abortTransaction()을 하면 지금까지 session안에서 수행된 모든 것들이 취소됨
      // await session.abortTransaction();
      // 그리고 사실 이 호출에 대해서는 transaction을 사용하지 않고 내장을 잘해도 괜찮음
      // Atomicity는 못지키지만 그럴일이 발생할 확률이 낮기 때문. 즉, 상황에따라 써야지 무조건쓰면 효율이 낮음
      // 암튼 위와 같은 경우엔 아래와 같은 코드가 효율적 (transaction 관련 코드 다지우고 적용하면 됨)
      // await Promise.all([
      //   comment.save(),
      //   Post.updateOne(
      //     { _id: postId },
      //     {
      //       $inc: { commentsCount: 1 },
      //       // 이거랑 아래꺼랑 같은처리인데 아래꺼가 병렬처리되서 더 효율 좋은 코드
      //       // $push: { comments: comment },
      //       $push: { comments: { $each: [comment], $slice: -3 } },
      //     }
      //   ),
      // ]);
      return res.status(201).json({ comment });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    } finally {
      await session.endSession();
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
