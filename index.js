const express = require("express");
const { connect } = require("./db/db");
const { authRoutes } = require("./routes/Auth.Routes");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

app.listen(process.env.PORT, async () => {
  console.log("server");
  try {
    await connect;
    console.log("connected");
  } catch (error) {
    console.log("err");
  }
});
