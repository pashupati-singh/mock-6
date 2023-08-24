const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (token) {
      jwt.verify(token, process.env.SKEY, (err, decoded) => {
        if (err) return res.json({ err: err });
        else if (decoded) {
          req.body.userID = decoded.userID;
          req.body.userName = decoded.userName;
          next();
        }
      });
    } else {
      res.json("token missing, login again");
    }
  } catch (error) {
    res.json({ err: error });
  }
};

module.exports = { auth };
