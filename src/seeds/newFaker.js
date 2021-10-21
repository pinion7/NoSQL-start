const faker = require("faker");
const { User, Post, Comment } = require("../models");
const axios = require("axios");
const URI = "http://localhost:3000";

generateFakeData = async (userCount, postsPerUser, commentsPerUser) => {
  try {
    if (typeof userCount !== "number" || userCount < 1)
      throw new Error("userCount는 양수여야만 합니다.");
    if (typeof postsPerUser !== "number" || postsPerUser < 1)
      throw new Error("postsPerUser는 양수여야만 합니다.");
    if (typeof commentsPerUser !== "number" || commentsPerUser < 1)
      throw new Error("commentsPerUser는 양수여야만 합니다.");
    let users = [];
    let posts = [];
    let comments = [];

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

    console.log("fake 데이터가 db에 입력됩니다.");

    await User.insertMany(users);
    console.log(`${users.length}개의 fake 유저가 생성되었습니다!`);

    users.map((user) => {
      for (let i = 0; i < postsPerUser; i++) {
        posts.push(
          axios.post(`${URI}/post`, {
            title: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            islive: true,
            userId: user.id,
          })
        );
      }
    });

    let newposts = await Promise.all(posts);
    console.log(`${newposts.length}개의 fake 게시글이 생성되었습니다!`);

    users.map((user) => {
      for (let i = 0; i < commentsPerUser; i++) {
        let index = Math.floor(Math.random() * posts.length);
        comments.push(
          axios.post(`${URI}/post/${newposts[index].data.post._id}/comment`, {
            content: faker.lorem.sentence(),
            userId: user.id,
          })
        );
      }
    });

    await Promise.all(comments);
    console.log(`${comments.length}개의 fake 댓글이 생성되었습니다!`);
    console.log("작업이 모두 완료되었습니다.");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { generateFakeData };
