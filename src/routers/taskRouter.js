const express = require("express");
const router = new express.Router();

// importing Task
const Task = require("../models/task.js");
const auth = require("../middlewares/auth.js");
// post request for new task
router.post("/tasks", /*load auth middleware*/ auth, async (req, res) => {
  try {
    // const task = new Task(req.body);
    const task = new Task({
      ...req.body,
      Owner: req.user._id,
    });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
  // task
  //   .save()
  //   .then(() => res.status(201).send(task))
  //   .catch((e) => {
  //     res.status(400).send(e);
  //   });
});

// get tasks
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
router.get("/tasks", auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};
    // console.log(req.query);
    // console.log(req.body.params);
    if (req.query.completed) {
      match.Completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    console.log(sort);
    // const tasks = await Task.find({ Owner: req.user._id });
    // const user = await User.findById(req.user._id);
    await req.user
      .populate({
        path: "tasks",
        // match contains the search criteria -> filter
        match,
        // pagination
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          // sorting
          // sort: {
          // Description: 1,
          // },
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
  // Task.find({})
  //   .then((task) => res.send(task))
  //   .catch((e) => res.status(500).send(e));
});

// get task by id
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById(id);
    const task = await Task.findOne({ _id, Owner: req.user._id });
    if (!task)
      return res
        .status(404)
        .send({ error: "task exists but you are not the owner :)" });
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
  // Task.findById(id)
  //   .then((task) => {
  //     if (!task) return res.status(404).send();
  //     res.send(task);
  //   })
  //   .catch((e) => res.status(500).send(e));
});

// update /patch - tasks
router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const validOptions = ["Description", "Completed"];
    const given = Object.keys(req.body);
    const check = given.every((e) => validOptions.includes(e));

    // checks if "check" is false
    if (!check) return res.status(400).send({ error: "invalid updates" });

    const task = await Task.findOne({ _id, Owner: req.user._id });

    // checks if "task" is not found , i.e , task is false
    if (!task) return res.status(404).send();

    given.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});
// delete all task
router.delete("/tasks/deleteall", auth, async (req, res) => {
  try {
    console.log(req.user._id);
    await Task.deleteMany({ Owner: req.user._id });
    res.send();
  } catch (e) {
    res.send(e);
  }
});
// delete a task
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOneAndDelete({ _id, Owner: req.user._id });
    if (!task) return res.status(404).send();
    // await task.remove();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// export the router
module.exports = router;
