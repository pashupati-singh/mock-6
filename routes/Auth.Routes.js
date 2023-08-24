const express = require("express");
const bcrypt = require("bcrypt");
const { AuthModel } = require("../model/AuthModel");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/Auth.middleware");
const { BlogsModel } = require("../model/Blogsmodel");
const authRoutes = express.Router();
require("dotenv").config();

authRoutes.post("/register", (req, res) => {
  const { userName, avatar, email, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) return res.json({ msg: err });
      else if (hash) {
        const user = await AuthModel({
          userName,
          avatar,
          email,
          password: hash,
        });
        await user.save();
        res.json({ msg: "register successfully" });
      }
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

authRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await AuthModel.findOne({ email });
  try {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.json({ msg: err });
        else if (result) {
          jwt.sign(
            { userID: user._id, userName: user.userName, userAv: user.avatar },
            process.env.SKEY,
            (err, token) => {
              if (err) return res.json({ msg: err });
              else if (token) {
                res.json({ msg: "Login succesfully", token });
              }
            }
          );
        }
      });
    } else {
      res.json("register first");
    }
  } catch (error) {
    res.json({ msg: error });
  }
});

authRoutes.use(auth);

authRoutes.post("/blogs", async (req, res) => {
  try {
    const blogs = await BlogsModel(req.body);
    await blogs.save();
    res.json({ msg: "blog get posted", blogs });
  } catch (error) {
    res.json({ err: error });
  }
});

authRoutes.get("/blogs", async (req, res) => {
  const { title } = req.query || "";
  const { category } = req.query || "";
  const { sort } = req.query || "";
  const { order } = req.query || "";

  const query = category ? { category } : {};
  const sorting = { [sort]: order };
  if (title) {
    query.$or = { title: { $regex: title, $option: "i" } };
  }
  const blogs = await BlogsModel.find(query).sort(sorting);

  res.json({ blogs });
});

authRoutes.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const { userID } = req.body;
  try {
    const blog = await BlogsModel.findOne({ _id: id });
    if (blog.userID === userID) {
      await BlogsModel.findByIdAndDelete({ _id: id });
      res.json({ msg: "blog deleted", blog });
    } else {
      res.json({ msg: "you are not Authorized to delete this blog" });
    }
  } catch (error) {
    res.json({ err: error });
  }
});

authRoutes.patch("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const { userID } = req.body;
  try {
    const blog = await BlogsModel.findOne({ _id: id });
    if (blog.userID === userID) {
      await BlogsModel.findByIdAndUpdate({ _id: id }, req.body);
      const blogs = await BlogsModel.findOne({ _id: id });
      res.json({ msg: "blog update", blogs });
    } else {
      res.json({ msg: "you are not Authorized to update this blog" });
    }
  } catch (error) {
    res.json({ err: error });
  }
});

module.exports = { authRoutes };
