const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const USERC = require("../libs/userControllerLibs.js");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: process.env.MYSQL_PW,
//   database: "sw_assignment_db",
// });

const SUPERUSER = "superuser";
const ADMIN = "admin";
const USER = "user";

// const isAuth = (roleArr) => (req, res, next) => {
//   if (req.session.role) {
//     for (const r of roleArr) {
//       if (req.session.role === r) {
//         return next();
//       }
//     }
//   }
//   res.status(404).json({ message: "Authentication required" });
// };

//* ======================         EDIT PASSWORD       ==============================

router.put("/edit/pass/:id", async function (req, res) {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.password;
  const hashNewPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
  const { id } = req.params;

  try {
    const result = await USERC.FindUserDataID(id)
    const checkResult = await USERC.CheckPassword(result.username, currentPassword)
    if (checkResult) {
      const data = await USERC.EditPassword(hashNewPassword, id)
      res.status(200).json(data)
    } else {
      res.status(400).json({message: "password incorrect"})
    }
  } catch (err) {
    console.log("error from catching block", err);
  }
});

//! ====================         EDIT EMAIL & STATUS        ==============================

// router.put("/edit/:ACTION/:ID", function (req, res) {
//   const { ID, ACTION } = req.params;
//   if (ACTION === "email") {
//     const newEmail = req.body.email;
//     const sqlQuery = `UPDATE users SET email = '${newEmail}' WHERE user_id = '${ID}'`;
//     connection.query(sqlQuery, (err, result) => {
//       if (err) res.status(400).json({ error: err.message });
//       else {
//         console.log("Change email success");
//         res.status(200).json(result);
//       }
//     });
//   } else if (ACTION === "status") {
//     const newStatus = req.body.status;
//     const sqlQuery = `UPDATE users SET status = '${newStatus}' WHERE user_id = '${ID}'`;
//     connection.query(sqlQuery, (err, result) => {
//       if (err) res.status(400).json({ error: err.message });
//       else {
//         console.log("Change status success");
//         res.status(200).json(result);
//       }
//     });
//   } else if (ACTION === "reset") {
//     const newPassword = req.body.password;
//     const hashNewPassword = bcrypt.hashSync(
//       newPassword,
//       bcrypt.genSaltSync(10)
//     );
//     const sqlQuery = `UPDATE users SET password = '${hashNewPassword}' WHERE user_id = '${ID}'`;
//     connection.query(sqlQuery, (err, result) => {
//       if (err) res.status(400).json({ error: err.message });
//       else {
//         console.log("reset password success");
//         res.status(200).json(result);
//       }
//     });
//   }
// });

//? ======================         CHECKGROUP SINGLE ID       ==============================

router.get("/checkgroup/:id", async function (req, res) {
  const { role, id } = req.body;
  try {
    (await USERC.CheckGroupID(id, role))
      ? res.status(200).json({ message: "User in a group" })
      : res.status(400).json({ message: "User not in a group" });
  } catch (error) {
    console.log("error from catch block", error);
  }
});
//* ======================         CREATE NEW USER       ==============================

router.post("/new", async function (req, res) {
  const { username, password } = req.body;
  try {
    (await USERC.CreateNewUser(username, password))
      ? res.status(200).json({ message: "User Created Successfully" })
      : res.status(400).json({ message: "Failed to create user" });
  } catch (error) {
    console.log("error from catch block", error);
  }
});

//* ======================         GET SPECIFIC USER       ==============================

router.get("/:id", async function (req, res) {
  const { id } = req.params;

  try {
    const data = await USERC.FindUserDataID(id);
    res.status(200).json(data);
  } catch (error) {
    console.log("error from catch block", error);
    res.status(400).json({ message: "User not found" });
  }
});

//* ======================         GET ALL USER       ==============================

router.get("/", async function (req, res) {
  try {
    const data = await USERC.FindAllUser();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
