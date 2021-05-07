const express = require("express");
const app = express();

// starting database
require("./db/mongoose.js");

// import user router
const userRouter = require("./routers/userRouter.js");

// import tasks router
const taskRouter = require("./routers/taskRouter.js");

// importing human
const Human = require("./models/human.js");

// expess middleware
// must be before out route handlers
// incoming request -> (do something) Middleware -> Route Handler

// maintenance purposes
// app.use((req, res, next) => {
//   res.status(503).send("Site under maintenance. Check back soon ! :)");
// });

// parse incoming JSON to javascript object
app.use(express.json());

// Regiter Router with existing application
app.use(userRouter);
app.use(taskRouter);

// set up port
const port = process.env.PORT;

// Test / Revision
app.post("/humans", (req, res) => {
  const human = new Human(req.body);
  human
    .save()
    .then((human) => res.send(human))
    .catch((e) => res.status(500).send(e));
});
app.get("/humans/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Human.findById(id);
    if (result) res.send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

const generatePassword = async () => {
  const bcrypt = require("bcrypt");
  const password = "Red@123";
  // bcrypt.hash(password, 8, (err, encrypt) => {
  //   if (err) return err;
  //   console.log(encrypt);
  // });
  const hashed = await bcrypt.hash(password, 8);
  console.log(hashed);

  const validate = await bcrypt.compare("", hashed);
  console.log(validate);
};
// generatePassword();

// json web token
const jwtFunc = function () {
  const jwt = require("jsonwebtoken");
  const token = jwt.sign({ id: "id124" }, "thisissecret");
  console.log(token);
  const verify = jwt.verify(token, "thisissecret");
  // console.table(verify);
  return verify;
};
const jwt1 = function () {
  const jwt = require("jsonwebtoken");
  const token = jwt.sign({ id: "123@" }, "thisisasecret", {
    expiresIn: "2 days",
  });
  const verify = jwt.verify(token, "thisisasecret");
  console.log(token);
  console.table(verify);
};
// console.log(jwtFunc());

// playground
const Task = require("./models/task");
const User = require("./models/user");
const main = async () => {
  // take task and find user

  // const task = await Task.findById("608d55752cfbbf071438ecf0");
  // console.log(task);
  // const user = await User.findById(task.Owner);
  // console.log(user);
  // await task.populate("Owner").execPopulate();
  // console.log(task.Owner);

  // take user and find the user
  // const user = await User.findById("608d556b2cfbbf071438ecee");
  // await user.populate("tasks").execPopulate();
  // console.log(user.tasks);
  const task = await Task.findById("608d5944c453a01714f17b12");
  await task.populate("Owner").execPopulate();
  console.log(task.Owner);
};

// main();
/*
const multer = require("multer");
const upload = multer({
  dest: "images",
  limits: {
    // limit the file size to 1 megaByte
    fileSize: 1000000,
  },
  fileFilter(req, File, cb) {
    if (!File.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error("Please upload a Word document"));
    }

    // accept the file
    cb(undefined, true);

    // reject the file
    // cb(undefined, false);
  },
});*/
// app.post(
//   "/uploads",
//   upload.single("file"),
//   (req, res) => {
//     res.send();
//   },
//   /*this call signature lets expree know that the function is designed to handle errors*/
//   (error, req, res, next) => {
//     res.status(404).send({ error: error.message });
//   }
// );
console.log(process.env.MONGODB_URL);
// listen
app.listen(port, () => console.log(`Listening at ${port}`));
