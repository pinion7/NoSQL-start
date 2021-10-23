console.log("클라이언트 코드 가동");
const axios = require("axios");

const URI = "http://localhost:3000";

// case 1 실험한 로직
// case 1: 하드하게 데이터를 호출하고 가공하는 방식 (비효율적)
const test2 = async () => {
  console.time("로딩 시간: ");
  let {
    data: { posts },
  } = await axios.get(`${URI}/post`);
  posts = await Promise.all(
    posts.map(async (post) => {
      const [resUserData, resCommentData] = await Promise.all([
        axios.get(`${URI}/user/${post.user}`),
        axios.get(`${URI}/post/${post._id}/comment`),
      ]);
      post.user = resUserData.data.user;
      post.comments = await Promise.all(
        resCommentData.data.comments.map(async (comment) => {
          let {
            data: { user },
          } = await axios.get(`${URI}/user/${comment.user}`);
          comment.user = user;
          return comment;
        })
      );
      return post;
    })
  );
  // console.log(data.posts[0]);
  // .log로 상세데이터가 안나올 때 .dir로 가능
  // console.dir(data.posts[0], { depth: 10 });
  console.timeEnd("로딩 시간: ");
};

const testGroup2 = async () => {
  await test2();
  await test2();
  await test2();
  await test2();
  await test2();
  await test2();
  await test2();
  await test2();
  await test2();
  await test2();
};

// testGroup2();

// case 2 & case 3 실험한 로직
// case 2: 몽구스의 부가 기능(populate)을 잘 활용하여 데이터를 호출하고 가공하는 방식
// case 3: 모델에 내장하는 방식으로 populate없이 데이터를 한번에 호출하는 방식
const test1 = async () => {
  console.time("로딩 시간: ");
  let {
    data: { posts },
  } = await axios.get(`${URI}/post`);
  // console.log(data.posts[0]);
  // .log로 상세데이터가 안나올 때 .dir로 가능
  // console.dir(data.posts[0], { depth: 10 });
  console.timeEnd("로딩 시간: ");
};

const testGroup1 = async () => {
  await test1();
  await test1();
  await test1();
  await test1();
  await test1();
  await test1();
  await test1();
  await test1();
  await test1();
  await test1();
};

testGroup1();
