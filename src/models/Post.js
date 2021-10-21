const { Schema, model, Types } = require('mongoose');

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  islive: { type: Boolean, required: true, default: false },
  user: { type: Types.ObjectId, required: true, ref: 'user' }
}, { timestamps: true });

const Post = model('post', PostSchema);

module.exports = { Post };