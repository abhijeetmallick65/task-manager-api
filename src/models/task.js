const mongoose = require("mongoose");

// create task schema
const taskSchema = new mongoose.Schema(
  {
    Description: {
      type: String,
      required: true,
      trim: true,
    },
    Completed: {
      type: Boolean,
      default: false,
    },
    Owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// create a new collection : Tasks
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
