const mongoose = require("mongoose");

const BlogsSchema = mongoose.Schema({
  userName: String,
  title: String,
  content: String,
  category: String,
  date: String,
  userID: String,
  userAv: String,
});

const BlogsModel = mongoose.model("blogs", BlogsSchema);

module.exports = { BlogsModel };
