const nodemailer = require("nodemailer");
let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "291d129dbc8268",
      pass: "faede9a00f4fb1"
    }
  });

// message = {
//   from: "from-example@email.com",
//   to: "to-example@email.com",
//   subject: "Subject",
//   text: "Hello SMTP Email",
// };


// transport.sendMail(message, function (err, info) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(info);
//   }
// });


function SendDoneEmail(devEmail, leadEmail) {
  console.log("dev", devEmail, "lead", leadEmail )
    const message = {
        from: `${devEmail}`,
        to: `${leadEmail}`,
        subject: "Finished Task",
        text: "I have completed the task",
      };
      
    return new Promise((resolve, reject) => {
        transport.sendMail(message, function (err, info) {
            if (err) {
              console.log(err);
            } else {
              resolve(info)
              console.log(info);
            }
          });
    });
  }


  module.exports = {
    SendDoneEmail }