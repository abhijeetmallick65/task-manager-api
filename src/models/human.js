const mongoose = require("mongoose");
const validator = require("validator");
// create model for human
const Human = mongoose.model("Human", {
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  age: {
    type: Number,
    required: function () {
      if (this.age < 20) throw new Error("error : age error");
    },
    default: 20,
  },
  password: {
    type: String,
    minLength: 6,
    trim: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (value.toLowerCase().includes("password"))
        throw new Error("password sould not contain the string password :)");
    },
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Email is invalid.");
    },
  },
});

module.exports = Human;
