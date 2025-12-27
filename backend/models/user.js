const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  ids: {
    type: Number,
    default: 0,
  },
  logs: [
    {
      operation: { type: String, default: "" },
      date: { type: Date, default: Date.now },
    },
  ],
});

UserSchema.statics.login = async function (username, password) {
  username = username.toLowerCase();
  const user = await this.findOne({ username });
  if (!user) {
    return {"status":"error","msg":"الاسم او كلمه السر خطآ"}
  }

  // const match = await bcrypt.compare(password, user.password);
  // if (!match) {
  //   return {"status":"error","msg":"الاسم او كلمه السر خطآ"}
  // }

  return {"status":"success","msg":user};
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
