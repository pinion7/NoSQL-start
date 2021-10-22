console.log("클라이언트 코드 가동");
const axios = require("axios");

const URI = "http://localhost:3000";

// case 1: 몽구스의 부가 기능(populate)을 잘 활용하여 데이터를 호출하고 가공하는 방식
// case 2: 모델에 내장하는 방식으로 populate없이 데이터를 한번에 호출하는 방식
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

// case1 테스트 결과: 효율적
// post 10개를 기준으로 populate를 활용해 user, comment 데이터를 불러올 때
// -> 평균 0.19초가 소요됨. case3에 비해 아주 크게 개선된 성능!
// 심지어 post 200개를 불러오더라도 평균 0.9초에 처리
// case3에 비해 압도적일 수밖에 없는 가장 큰 이유는 axios 요청횟수에 거대한 차이가 있기 때문임
// 즉 효율적으로 클라입장에서 성능을 개선하려면 axios 요청 횟수를 줄일 생각을 해야함.

// cast2 테스트 결과 : 더 효율적
// populate를 사용하지 않고, model 스키마 자체를 수정해서 애초에 데이터 저장시 확장된 데이터를 저장함
// 그렇기 때문에 따로 가공하지 않고 이미 가공된 데이터를 호출하게되서 더 성능적으로 진보
// -> 평균 0.05초가 소요됨. 굉장히 빠른 속도
// 심지어 200개를 불러오더라도 평균 0.17초에 처리
// case1보다 그렇다고 무조건 더 좋은방식은 아니고, 서비스가 처한 상황에 따라 각각이 다쓰여야함.
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

// case 3: 하드하게 데이터를 호출하고 가공하는 방식 (비효율적)
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

// case3 테스트 결과: 비효율적인 방식임이 증명됨
// 왜냐하면 post 10개를 기준으로 그거에 딸린 user, comment 데이터를 불러올 때
// -> 평균 3초가 소요됨. 아주아주 성능이 안좋은 것임. 0.5초가 마지노선이라고 생각해야함.
// case3는 되도록 지양해야하는 방식
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
