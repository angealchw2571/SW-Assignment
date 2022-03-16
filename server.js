require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");
const bcrypt = require("bcrypt");
const userController = require("./controllers/user_controller");
const sessionController = require("./controllers/session_controller");


//? =========================    Config    =========================

const PORT = process.env.PORT ?? 3001;
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PW,
  database: "sw_assignment_db",
});

connection.connect(function (err) {
  if (err) console.log(err);
  else console.log("connected to local mysql");
});

//? =========================    Middleware    =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));


//? =========================    Controllers    =========================


app.use("/api/user", userController);
app.use("/api/session", sessionController);


//? =========================    Routes      =========================


app.get("/main", function (req, res) {
  res.render("mainMenu.ejs");
});

app.get("/login", function (req, res) {
  res.render("homepageLogin.ejs");
});

app.get("/new", function (req, res) {
  res.render("newUser.ejs");
});





app.listen(PORT, () => {
  console.log(`server app listening at ${PORT}`);
});
