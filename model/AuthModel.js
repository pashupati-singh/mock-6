const mongoose = require("mongoose");

const AuthSchema = mongoose.Schema({
  userName: String,
  avatar: String,
  email: String,
  password: String,
});

const AuthModel = mongoose.model("user", AuthSchema);

module.exports = { AuthModel };
