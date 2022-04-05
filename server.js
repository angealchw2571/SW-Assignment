require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");
const userController = require("./controllers/user_controller");
const sessionController = require("./controllers/session_controller");
const appController = require("./controllers/app_controller");


//? =========================    Config    =========================

const PORT = process.env.PORT ?? 3001;
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PW,
  database: "assignment_db",
});

connection.connect(function (err) {
  if (err) console.log(err);
  else console.log("connected to local mysql");
});

//? =========================    Middleware    =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));
app.use(
  session({
    secret: process.env.SESSION_SECRET, //a random string do not copy this value or your stuff will get hacked
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false, // default  more info: https://www.npmjs.com/package/express-session#resave
  })
);


//? =========================    Controllers    =========================


app.use("/api/user", userController);
app.use("/api/session", sessionController);
app.use("/api/app", appController);


//? =========================    Routes      =========================


app.listen(PORT, () => {
  console.log(`server app listening at ${PORT}`);
});
