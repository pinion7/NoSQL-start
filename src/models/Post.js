const { Schema, model, Types } = require("mongoose");
const { CommentSchema } = require("./Comment");

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    user: {
      _id: { type: Types.ObjectId, required: true, ref: "user", index: true },
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

// 코드상 인덱스를 이렇게 적용할 수도 있음. 중간에 추가해서 서버가동만해도 바로바로 적용이 됨
// 두개 조건을 동시에 넣으면 복합키로 생성이 됨.
// 또한 text의 경우, text를 찾을 수 있도록 도와줌 (여러 단어를 넣으면(띄어쓰기로 구분) 해당 단어가 모두 포함되는 것들 모두 탐색)
// text 인덱스의 역할을 정리하자면, 모든 단어들을 키워드로 분리시키고, 무의미한 단어들은 제외시키고, 검색에 쓰일만한 단어들만 쫙 뽑은 뒤
// 그것들을 가지고 인덱스를 내림차순이나 오름차순으로 걸어서 find하게 됨
PostSchema.index({ "user.id": 1, updatedAt: 1 });
PostSchema.index({ title: "text", content: "text" });

// 가상 코멘트 필드 생성하는 방식
// PostSchema.virtual("comments", {
//   ref: "comment",
//   localField: "_id",
//   foreignField: "post",
// });
// PostSchema.set("toObject", { virtuals: true });
// PostSchema.set("toJSON", { virtuals: true });

const Post = model("post", PostSchema);

module.exports = { Post };
