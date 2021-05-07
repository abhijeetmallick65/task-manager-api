const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

// const auth = async function (req, res, next) {
//   try {
//     const token = req.header("Authorization").replace("Bearer ", "");
//     const data = jwt.verify(token, "thisisasecret");
//     const user = await User.findOne({ _id: data._id, "tokens.token": token });
//     if (!user) throw new Error();
//     req.user = user;
//     next();
//   } catch (e) {
//     res.status(503).send({ error: "Please authenticate" });
//   }
// };

const auth = async function (req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decode = jwt.verify(token, process.env.JWT);

    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) throw new Error("User not found");
    req.user = user;
    req.token = token;

    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: e ? e : "Please authenticate" });
  }
};

module.exports = auth;
