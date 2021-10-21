const { Schema, model, Types } = require('mongoose');

const CommentSchema = new Schema({
  content: { type: String, required: true },
  user: { type: Types.ObjectId, required: true },
  post: { type: Types.ObjectId, required: true },
}, { timestamps: true });

const Comment = model('comment', CommentSchema);

module.exports = { Comment };