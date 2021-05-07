"use strict";

// require nodemailer
const nodemailer = require("nodemailer");

// google app password
// const password = process.env.PASSWORD;
// const password = "eyvmqjzhhwejuhvn";

// transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abhijeetmallick29@gmail.com",
    // pass: "eyvmqjzhhwejuhvn",
    pass: process.env.PASSWORD,
  },
});

// signup
const sendMailSignup = (email, name) => {
  console.log(email, name);
  // mail options
  const mailoptions = {
    from: "abhijeetmallick29@gmail.com",
    to: email,
    subject: "Signup mail",
    text: `Hello ${name}, thanks for joining us. Glad to have you on board!`,
  };

  //send mail
  transporter
    .sendMail(mailoptions)
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
};

// delete email
const sendMailDelete = (email, name) => {
  console.log(email, name);

  const mailOptions = {
    from: "abhijeetmallick29@gmail.com",
    to: email,
    subject: "Unregister email",
    text: `confirmation email`,
  };
  transporter
    .sendMail(mailOptions)
    .then((res) => console.log(res.response))
    .catch((e) => console.error(e));
};
// export
module.exports = {
  // export multiple objects from a file -> export in form of object
  sendMailSignup,
  sendMailDelete,
};

// practice code
// // transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "abhijeetmallick29@gamil.com",
//     pass: "Vasant65",
//   },
// });

// // mailoptions
// const mailOptions = {
//   from: "abhijeetmallick29@gmail.com",
//   to: "abhijeetmallick29@gmail.com",
//   subject: "this is a subject",
//   text: "this is a text",
// };

// // send mail
// transporter
//   .sendMail(mailOptions)
//   .then((res) => console.log(res.info))
//   .catch((err) => console.log(err));
// var transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "abhijeetmallick29@gmail.com",
//     pass: "eyvmqjzhhwejuhvn",
//   },
// });

// var mailOptions = {
//   from: "abhijeetmallick29@gmail.com",
//   to: "mallick.abhijeet@yahoo.in",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
// };

// transporter
//   .sendMail(mailOptions)
//   .then((res) => console.log(res))
//   .catch((e) => console.log(e));

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "abhijeetmallick29@gmail.com",
//     pass: "eyvmqjzhhwejuhvn",
//   },
// });

// const mail = {
//   from: "abhijeetmallick29@gmail.com",
//   to: "mallick.abhijeet@yahoo.in,abhijeetmallick29@gmail.com",
//   subject: "this is a test",
//   html: "<h1> this is a heading </h1>",
// };

// transporter
//   .sendMail(mail)
//   .then((res) => console.log(res.response))
//   .catch((e) => console.error(e));
