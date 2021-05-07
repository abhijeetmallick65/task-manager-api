const express = require("express");
const router = new express.Router();
const auth = require("../middlewares/auth.js");
// importing user
const User = require("../models/user.js");
// multer
const multer = require("multer");
// sharp
const sharp = require("sharp");
// email
const { sendMailSignup, sendMailDelete } = require("../emails/account.js");

// post request for new user
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    // sending mail is async but we do not need the code to stop while email is being send.
    sendMailSignup(user.email, user.name);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
  // user
  //   .save()
  //   .then(() => {
  //     res.send(user);
  //   })
  //   .catch((e) => {
  //     res.status(400).send(e);
  //   });
});
// USER LOGIN
router.post("/users/login", async function (req, res) {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    await user.save();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: `${e}` });
  }
});

// get request for user profile
router.get("/users/me", auth, async (req, res) => {
  // tojson method runs before sending the data
  res.send(req.user);
  // try {
  //   // fetch all "users/documents from the collection" -> user
  //   const user = await User.find({});
  //   res.send(user);
  // } catch (e) {
  //   res.status(500).send(e);
  // }
  // .then((user) => res.send(user))
  // .catch((e) => res.status(500).send(e));
});

// get user by id
// router.get("/users/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// .then((user) => {
//   if (!user) {
//     res.status(404).send();
//   }
//   res.send(user);
// })
// .catch((e) => {
//   res.status(500).send(e);
// });
// });

// update / patch - users
router.patch("/users/me", auth, async (req, res) => {
  const validOptions = ["name", "email", "password", "age"];
  console.log(req.body);
  const given = Object.keys(req.body);
  const check = given.every((value, index, arr) =>
    validOptions.includes(value)
  );
  if (!check) return res.status(400).send();
  try {
    // const _id = req.params.id;
    // const user = await User.findById(_id);

    // if (!user) return res.status(404).send();

    given.forEach((update) => {
      req.user[update] = req.body[update];
    });

    // middleware executes here
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// delete an user
router.delete("/users/me", auth, async (req, res) => {
  // const _id = req.params.id;
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) return res.status(404).send({ error: "Invalid Id" });
    sendMailDelete(req.user.email, req.user.name);
    await req.user.remove();

    res.send(req.user);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

// logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
// logout all
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// file upload

const upload = multer({
  // dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid file."));
    }
    cb(undefined, true);
  },
});

// File upload -> create / update
router.post(
  "/user/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ errpr: error.message });
  }
);
// File upload -> delete
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.send(e);
  }
});

// serve images to client -> serve to client -> 'GET' REQUEST
// File upload -> read
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});
// export the router
module.exports = router;
