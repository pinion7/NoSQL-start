const { User, Post, Comment } = require("../models");
const { isValidObjectId } = require("mongoose");

module.exports = {
  findAll: async (req, res) => {
    try {
      const users = await User.find({});
      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
    }
  },

  findOne: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "userId가 유효하지 않습니다." });
      }
      const user = await User.findOne({ _id: userId });
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  createOne: async (req, res) => {
    try {
      console.log(req.body);
      const { username, name, age } = req.body;
      if (!username) {
        return res.status(400).json({ message: "username이 필요합니다" });
      }
      if (!name || !name.first || !name.last) {
        return res
          .status(400)
          .json({ message: "first, last가 모두 필요합니다." });
      }
      const user = new User({ username, name, age });
      console.log(user);
      await user.save();
      return res.send({ user });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  updateAll: async (req, res) => {
    try {
      const { userId } = req.params;
      const { age, name } = req.body;
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "userId가 유효하지 않습니다." });
      }
      if (age && typeof age !== "number") {
        return res.status(400).json({ message: "age는 숫자여야만 합니다." });
      }
      if (
        name &&
        typeof name.first !== "string" &&
        typeof name.last !== "string"
      ) {
        return res
          .status(400)
          .json({ messsage: "first&last가 문자열이어야만 합니다." });
      }

      const updateBody = {};
      if (age) {
        updateBody.age = age;
      }
      if (name) {
        updateBody.name = name;
        await Promise.all([
          Post.updateMany({ "user._id": userId }, { "user.name": name }),
          Post.updateMany(
            {},
            { "comments.$[el].user.name": name },
            { arrayFilters: [{ "el.user._id": userId }] }
          ),
          Comment.updateMany({ "user._id": userId }, { "user.name": name }),
        ]);
      }
      // $set은 써도되고 안써도 됨. 즉, 몽구스 스스로 두번째인자를 알아서 업데이트 대상으로 인식한다
      await User.updateOne({ _id: userId }, updateBody);
      return res
        .status(200)
        .json({ message: "user 업데이트에 성공하였습니다." });

      // 1. other case 1: 업데이트 결과를 얻고 싶을 경우
      // 업데이트만 하는 것이아닌, 업데이트된 결과를 얻고 싶다면, mongoose가 지원하는 메소드를 활용하면 id로 바로 접근해서 값을 찾을 수 있다.
      // 단, 보통은 변경 전의 값이 할당된다. 업데이트 후의 결과를 원한다면 3번째 인자로 옵션을 줘야하는데, new: true로 설정해줘야한다.
      // const user = User.findByIdAndUpdate(userId, { $set: updateBody }, { new: true });
      // return res.status(200).json({ user });

      // 2. other case 2: 업데이트를 하는 또 다른 방식
      // 일단 db에서 user를 찾고, 값을 바꿔준다음에. save()를 활용하여 업데이트 해줄 수 있다.
      // 아래처럼 작성할 경우, save() 메소드가 알아서 바뀐 값만 updateOne 쿼리를 진행해준다.
      // const user = await User.findById(userId);
      // if (age) {
      //   user.age = age;
      // }
      // if (name) {
      //   user.name = name;
      //   await Promise.all([
      //     Post.updateMany({ "user._id": userId }, { "user.name": name }),
      //     Post.updateMany(
      //       {},
      //       { "comments.$[el].user.name": name },
      //       { arrayFilters: [{ "el.user._id": userId }] }
      //     ),
      //     Comment.updateMany({ "user._id": userId }, { "user.name": name }),
      //   ]);
      // }
      // await user.save();
      // return res.status(200).json({ user });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },

  deleteOne: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "userId가 유효하지 않습니다." });
      }

      await Promise.all([
        User.deleteOne({ _id: userId }),
        Post.deleteMany({ "user._id": userId }),
        Post.updateMany(
          { "comments.user._id": userId },
          { $pull: { comments: { user: userId } } }
        ),
        Comment.deleteMany({ "user._id": userId }),
      ]);
      return res.status(200).json({ messsage: "user 삭제에 성공하였습니다." });
    } catch (err) {
      return res.status(500).json({ message: "서버 에러" });
    }
  },
};
