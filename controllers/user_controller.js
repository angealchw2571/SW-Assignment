const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PW,
  database: "sw_assignment_db",
});

//! ======================         EDIT PASSWORD       ==============================

router.put("/edit/pass/:id", function (req, res) {
  const newPassword = req.body.password
  const {id} = req.params
  const hashNewPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))
  const sqlQuery = `UPDATE users SET password = '${hashNewPassword}' WHERE user_id = '${id}'`
  connection.query(sqlQuery, (err, result) => {
    if (err) res.status(400).json({ error: err.message });
    else {
      console.log("Change password success")
      res.status(200).json(result);
    }
  });
});

//! ======================         EDIT EMAIL       ==============================

router.put("/edit/email/:id", function (req, res) {
  const newEmail = req.body.email
  const {id} = req.params
  const sqlQuery = `UPDATE users SET email = '${newEmail}' WHERE user_id = '${id}'`
  connection.query(sqlQuery, (err, result) => {
    if (err) res.status(400).json({ error: err.message });
    else {
      console.log("Change email success")
      res.status(200).json(result);
    }
  });
});

//! ======================         CREATE NEW USER       ==============================

router.post("/new", function (req, res) {
  const { username, password, email } = req.body;
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  connection.query(
    `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${hashPassword}');`,
    (err) => {
      if (err) res.status(400).json({ error: err.message });
      else {
        console.log("User created successfully");
        res.status(200).json({ message: "User created successfully" });
      }
    }
  );
});

//! ======================         GET SPECIFIC USER       ==============================

router.get("/:id", function (req, res) {
  const {id} = req.params
  connection.query(`SELECT * FROM users WHERE user_id = '${id}';`, (err, result) => {
    if (err) res.status(400).json({ error: err.message });
    else {
      res.status(200).json(result);
    }
  });
});

//! ======================         GET ALL USER       ==============================

router.get("/", function (req, res) {
  connection.query(`SELECT * FROM users;`, (err, result) => {
    if (err) res.status(400).json({ error: err.message });
    else {
      res.status(200).json(result);
    }
  });
});
module.exports = router;
