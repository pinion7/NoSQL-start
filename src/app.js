const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { userRouter, postRouter, commentRouter } = require("./routes");
const { generateFakeData } = require("./seeds/newFaker");
dotenv.config();

app.use(express.json());
const MONGO_URI = `mongodb+srv://mandos:${process.env.MONGO_PASSWORD}@cluster0.wikwi.mongodb.net/MongoBlog?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI);
// mongoose.set("debug", true);

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/post/:postId/comment", commentRouter);

app.listen(3000, async () => {
  console.log("서버 가동");
  // for (let i = 0; i < 5; ++i) {
  // generateFakeData(10, 5, 10);
  // }
});

module.exports = app;
