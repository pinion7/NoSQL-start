const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    age: { type: Number, index: true },
    email: String,
  },
  { timestamps: true }
);

// 가상스키마 생성 시, get 뒤에 화살표함수가 안먹으니 주의 (원인 파악 필요)
UserSchema.virtual("fullName").get(function () {
  if (!this.name.first || !this.name.last) {
    return null;
  }
  return `${this.name.first} ${this.name.last}`;
});
UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

const User = model("user", UserSchema);
module.exports = { User };
