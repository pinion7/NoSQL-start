const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/userRoute');
const { postRouter } = require("./routes/postRoute");
const { commentRouter } = require("./routes/commentRoute");
dotenv.config();

app.use(express.json());
const MONGO_URI = `mongodb+srv://mandos:${process.env.MONGO_PASSWORD}@cluster0.wikwi.mongodb.net/MongoBlog?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI);
mongoose.set('debug', true);

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/post/:postId/comment', commentRouter);

app.listen(3000, () => console.log("서버 가동"));

module.exports = app;