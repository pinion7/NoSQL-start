const faker = require("faker");
const { User, Post, Comment } = require("../models");

// fake 데이터 생성 및 가공하여 db에 삽입하는 로직
generateFakeData = async (userCount, postsPerUser, commentsPerUser) => {
  if (typeof userCount !== "number" || userCount < 1) {
    throw new Error("userCount는 양수여야만 합니다.");
  }
  if (typeof postsPerUser !== "number" || postsPerUser < 1) {
    throw new Error("postsPerUser는 양수여야만 합니다.");
  }
  if (typeof commentsPerUser !== "number" || commentsPerUser < 1) {
    throw new Error("commentsPerUser는 양수여야만 합니다.");
  }
  const users = [];
  const posts = [];
  const comments = [];
  console.log("fake 데이터 준비 완료");

  for (let i = 0; i < userCount; i++) {
    users.push(
      new User({
        username: faker.internet.userName() + parseInt(Math.random() * 100),
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
        },
        age: 10 + parseInt(Math.random() * 50),
        email: faker.internet.email(),
      })
    );
  }

  users.map((user) => {
    for (let i = 0; i < postsPerUser; i++) {
      posts.push(
        new Post({
          title: faker.lorem.words(),
          content: faker.lorem.paragraphs(),
          islive: true,
          user: user.toObject(),
        })
      );
    }
  });

  users.map((user) => {
    for (let i = 0; i < commentsPerUser; i++) {
      let index = Math.floor(Math.random() * posts.length);
      comments.push(
        new Comment({
          content: faker.lorem.sentence(),
          user: user.toObject(),
          post: posts[index]._id,
        })
      );
    }
  });

  console.log("fake 데이터가 db에 입력됩니다.");
  await User.insertMany(users);
  console.log(`${users.length}개의 fake 유저가 생성되었습니다!`);
  await Post.insertMany(posts);
  console.log(`${posts.length}개의 fake 게시글이 생성되었습니다!`);
  await Comment.insertMany(comments);
  console.log(`${comments.length}개의 fake 댓글이 생성되었습니다!`);
  console.log("작업이 모두 완료되었습니다.");
};

module.exports = { generateFakeData };
