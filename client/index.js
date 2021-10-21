console.log("클라이언트 코드 가동");
const axios = require("axios");

const URI = "http://localhost:3000";

const test = async () => {
  const resPostData = await axios.get(`${URI}/post`);
  const { data } = resPostData;
  data.posts = await Promise.all(
    data.posts.map(async (post) => {
      const [resUserData, resCommentData] = await Promise.all([
        axios.get(`${URI}/user/${post.user}`),
        axios.get(`${URI}/post/${post._id}/comment`),
      ]);
      post.user = resUserData.data.user;
      post.comments = await Promise.all(
        resCommentData.data.comments.map(async (comment) => {
          const { data } = await axios.get(`${URI}/user/${comment.user}`);
          comment.user = data.user;
          return comment;
        })
      );
      return post;
    })
  );
  // console.log(data.posts[0]);
  // .log로 상세데이터가 안나올 때 .dir로 가능
  console.dir(data.posts[0], { depth: 10 });
};

test();
