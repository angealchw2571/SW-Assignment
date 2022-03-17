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

const SUPERUSER = "superuser";
const ADMIN = "admin";
const USER = "user";

const isAuth = (roleArr) => (req, res, next) => {
  if (req.session.role) {
    for (const r of roleArr) {
      if (req.session.role === r) {
        return next();
      }
    }
  }
  res.status(404).json({ message: "Authentication required" });
};

const SQLArg = 'user_id, username, email, role, status'





//! ======================         EDIT PASSWORD       ==============================

router.put("/edit/pass/:id",isAuth([ADMIN]), function (req, res) {
  const newPassword = req.body.password
  const {id} = req.params;
  console.log("jelloooooo", id)
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

//! ====================         EDIT EMAIL & STATUS        ==============================

router.put("/edit/:ACTION/:ID",isAuth([ADMIN]), function (req, res) {
  const {ID,ACTION} = req.params
  
  if (ACTION === "email") {
    const newEmail = req.body.email
    const sqlQuery = `UPDATE users SET email = '${newEmail}' WHERE user_id = '${ID}'`
    connection.query(sqlQuery, (err, result) => {
      if (err) res.status(400).json({ error: err.message });
      else {
        console.log("Change email success")
        res.status(200).json(result);
      }
    });

  } else if (ACTION === "status"){
    const newStatus = req.body.status
    const sqlQuery = `UPDATE users SET status = '${newStatus}' WHERE user_id = '${ID}'`
    connection.query(sqlQuery, (err, result) => {
      if (err) res.status(400).json({ error: err.message });
      else {
        console.log("Change status success")
        res.status(200).json(result);
      }
    });
  }
  
});
  

//! ======================         CREATE NEW USER       ==============================

router.post("/new",isAuth([ADMIN]), function (req, res) {
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

router.get("/:id" ,isAuth([ADMIN, SUPERUSER, USER]), function (req, res) {
  const {id} = req.params
  connection.query(`SELECT ${SQLArg} FROM users WHERE user_id = '${id}';`, (err, result) => {
    if (err) res.status(400).json({ error: err.message });
    else {
      res.status(200).json(result);
    }
  });
});


//! ======================         GET ALL USER       ==============================

router.get("/",isAuth([ADMIN, SUPERUSER]), function (req, res) {
  connection.query(`SELECT ${SQLArg} FROM users;`, (err, result) => {
    if (err) res.status(400).json({ error: err.message });
    else {
      res.status(200).json(result);
    }
  });
});





module.exports = router;
