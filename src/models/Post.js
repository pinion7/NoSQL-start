const { Schema, model, Types } = require("mongoose");
const { CommentSchema } = require("./Comment");

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    user: {
      _id: { type: Types.ObjectId, required: true, ref: "user" },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    comments: [
      {
        content: { type: String, required: true },
        user: {
          _id: { type: Types.ObjectId, required: true, ref: "user" },
          username: { type: String, required: true },
          name: {
            first: { type: String, required: true },
            last: { type: String, required: true },
          },
        },
      },
    ],
  },
  { timestamps: true }
);

// 가상 코멘트 필드 생성
// PostSchema.virtual("comments", {
//   ref: "comment",
//   localField: "_id",
//   foreignField: "post",
// });
// PostSchema.set("toObject", { virtuals: true });
// PostSchema.set("toJSON", { virtuals: true });

const Post = model("post", PostSchema);

module.exports = { Post };
