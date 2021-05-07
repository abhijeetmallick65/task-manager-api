const { MongoClient, ObjectID } = require("mongodb");
const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

// const id = new ObjectID();
// const _id = new ObjectID("6076a9525575922b8cbff4ec");
// console.log(id);
// console.log(id.getTimestamp());

MongoClient.connect(connectionUrl, (error, client) => {
  if (error) {
    return console.log("Unable to connect to database");
  }
  const db = client.db(databaseName);
  // db.collection("users").insertOne({
  //   _id: id,
  //   name: "Andrew",
  //   age: 21,
  // });

  // find one : findOne
  // db.collection("tasks").findOne({ _id }, (error, res) => {
  //   if (error) return console.log(error);
  //   console.log(res);
  // });

  // find multiple : find
  // db.collection("users")
  //   .find({ age: 21 })
  //   .toArray((err, users) => {
  //     console.log(users);
  //   });
  // db.collection("users")
  //   .find({ age: 21 })
  //   .count((r, n) => console.log(n));

  // challenge
  // db.collection("tasks").findOne(
  //   {
  //     _id: new ObjectID("6076a9525575922b8cbff4ee"),
  //   },
  //   (error, task) => {
  //     if (error) return console.log(error);
  //     console.log(task);
  //   }
  // );

  // db.collection("tasks")
  //   .find({ completed: false })
  //   .toArray((error, result) => {
  //     if (error) return console.log(error);
  //     console.log(result);
  //   });

  // Update

  // updateOne
  // db.collection("tasks")
  //   .updateOne(
  //     { description: "Node.js" },
  //     {
  //       $set: {
  //         completed: false,
  //       },
  //     }
  //   )
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err));

  // updateMany
  // db.collection("tasks")
  //   .updateMany(
  //     { completed: false },
  //     {
  //       $set: { completed: true },
  //     }
  //   )
  //   .then((res) => console.log(res.modifiedCount))
  //   .catch((err) => console.log(err));

  // delete
  // deleteMany
  db.collection("tasks")
    .deleteMany({ completed: true })
    .then((res) => console.log(res.deletedCount))
    .catch((err) => console.log(err));
  // deleteOne
  db.collection("users")
    .deleteOne({ name: "Rebecca" })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  db.collection("users")
    .deleteOne({ age: 21 })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});
