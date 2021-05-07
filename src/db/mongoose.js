const mongoose = require("mongoose");
const validator = require("validator");

// connect to the database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// creating instances :

/*
// user instances
const me = new User({
  name: "           abhijeeT ",
  email: "abhijeetMALLICK29@gmAIL.com",
  password: " Abhijeet123",
});
me.save()
  .then(() => console.log(me))
  .catch((err) => console.log(err));
*/
/*
// task instances
const task1 = new Task({
  Description: "node.js",
});
task1
  .save()
  .then(() => console.log(task1))
  .catch((err) => console.log(err));
*/
// const person = new User({
//   name: "person2",
//   age: 14,
// });

// person
//   .save()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

// create a new document to save in the collection : "Tasks" -> task1
// const task1 = new Tasks({
//   Description: "Check todo list 2",
// });

// save the new task to the db : in the model / collection : Tasks
// thus, task1 is a new document , which we will save to the 'Tasks' collection in the database.

// save the new document in the collection
// task1
//   .save()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

// mongoose with validation
// collection

// const h1 = new Human({
//   name: "andrew",
//   email: "andREW@GMAIL.com",
//   age: 20,
//   password: "name@123      ",
// });
// h1.save()
//   .then(() => console.log(h1))
//   .catch((e) => console.log(e));

// task2
// const task2 = new Tasks({
//   Description: "text",
// });
// task2
//   .save()
//   .then(() => console.log(task2))
//   .catch((e) => console.log(e));
/*
const species = mongoose.model("Specie", {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const s1 = new species({
  name: "Plant",
  age: 100,
});

s1.save()
  .then(() => console.log(s1))
  .catch((err) => console.log(err));
*/
