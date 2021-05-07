const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("../models/task.js");
// schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    age: {
      default: 0,
      type: Number,
      validate(value) {
        if (value < 0)
          throw new Error("Age can not be negative you dummy ! :)");
      },
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Please provide a valid email !");
      },
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("Password cannot contain password you dummy ! :)");
      },
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

// virtual property : not stored in db, relationship between 2 entities -> user and task in this case
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "Owner",
});

// generate tokens
// .methods -> accessible on the instances of the model
userSchema.methods.generateAuthToken = async function () {
  // const user = this;
  // const token = jwt.sign({ _id: user._id.toString() }, "thisisasecret", {
  //   expiresIn: "7 days",
  // });
  // user.tokens.push({ token });
  // await user.save();
  // return token;
  try {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT, {
      expiresIn: "7 days",
    });
    user.tokens.push({ token });
    await user.save();
    return token;
  } catch (e) {
    throw new Error({ error: e });
  }
};

// userSchema.methods.generatePublicProfile = function () {
//   const user = this;
//   console.log(user);
//   const updateUser = user.toObject();
//   delete updateUser.tokens;
//   delete updateUser.password;
//   return updateUser;
// };

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

// find user by credentials
// statics -> accessible on the entire collection / model
userSchema.statics.findByCredentials = async function (email, password) {
  // email check
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login !");

  // password check
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login !");

  // return user
  return user;
};
// adding a middleware for password check
userSchema.pre("save", async function (next) {
  // this refers to the current document in middleware
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
// middleware for removing tasks associated to an user who deletes themselves
userSchema.pre("remove", async function (next) {
  const user = this;
  const tasks = await Task.deleteMany({ Owner: user._id });
  next();
});
// create a new collection : Users
const User = mongoose.model("User", userSchema);

module.exports = User;
