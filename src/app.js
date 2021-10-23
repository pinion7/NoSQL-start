const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { userRouter, postRouter, commentRouter } = require("./routes");
const { generateFakeData } = require("./seeds/newFaker");
dotenv.config();

app.use(express.json());

// 옵션 추가
mongoose
  .connect(process.env.MONGO_STRING, {
    // useNewUrlParser: true, // 버전 5 이상부터 적용되는 새로운 url parser 사용
    useUnifiedTopology: true, // shard 와 replica set 에 접근
    // dbName: process.env.MONGO_DATABASE_NAME, // connection string 에 있는 db 대신 다른 디폴트 db 지정
  })
  .then(() => console.log("mongoDB 연결 성공"))
  .catch((err) => console.error("mongoDB 연결 실패"));
// mongoose.set("debug", true);

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/post/:postId/comment", commentRouter);

app.listen(3000, async () => {
  console.log("서버 가동");
  // for (let i = 0; i < 5; ++i) {
  // generateFakeData(10, 2, 10);
  // }
});

module.exports = app;
