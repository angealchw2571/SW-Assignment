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

//! ==========================         LOGIN        ==============================

router.post("/login", function (req, res) {
  const { username, password } = req.body;
  connection.query(
    `SELECT * FROM users WHERE username= '${username}';`,
    (err, result) => {
      const data = result[0]
      const dbPassword = result[0]?.password;
      if (result[0]) {
        bcrypt.compare(password, dbPassword, function (err, result) {
          if (result) {
            req.session.loginUser = data
            req.session.role = data.role
            res.status(200).json(data);
          } else {
            return res.status(404).json({ message: "Password incorrect" })
            ;
          }
        });
      } else if (result[0] === undefined) {
        res
          .status(404)
          .json({ message: "User not found. Please check again." });
      } else console.log("error", err);
    }
  );
});

//! ==========================         LOGOUT        ==============================

router.delete("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "session destroyed" });
  });
});

module.exports = router;
