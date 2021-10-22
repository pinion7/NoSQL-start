const { Schema, model, Types } = require("mongoose");

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    user: {
      _id: { type: Types.ObjectId, required: true, ref: "user", index: true },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    post: { type: Types.ObjectId, required: true, ref: "post" },
  },
  { timestamps: true }
);

CommentSchema.index({ post: 1, createdAt: -1 });

const Comment = model("comment", CommentSchema);

module.exports = { Comment };
