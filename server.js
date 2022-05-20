require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");
const userController = require("./controllers/user_controller");
const sessionController = require("./controllers/session_controller");
const appController = require("./controllers/app_controller");
const a3Controller = require("./controllers/assignment3_controller");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const JWTFunction = require("./libs/jwtLib");
const USERC = require("./libs/userControllerLibs.js");

//? =========================    Config    =========================
const PORT = process.env.PORT ?? 3001;
const connection = mysql.createConnection({
  host: "host.docker.internal",
  // host: "localhost",
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
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET, //a random string do not copy this value or your stuff will get hacked
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false, // default  more info: https://www.npmjs.com/package/express-session#resave
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

const authorisationFunc = async (JWT, authheader) => {
  if (JWT) {
    const result = JWTFunction.validateJWT(JWT);
    console.log("auth from jwt");
    return result;
  } else if (authheader) {
    console.log("auth from basic auth");
    const auth = new Buffer.from(authheader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const username = auth[0];
    const password = auth[1];
    const result = await USERC.FindUserData(username);
    if (result) {
      const passwordCheck = await USERC.CheckPassword(username, password);
      if (passwordCheck) {
        return result[0];
      } else {
        return "PASSWORD";
      }
    } else {
      return "USER";
    }
  } else {
    return false;
  }
};

const isAuth = async (req, res, next) => {
  try {
    const authResult = await authorisationFunc(
      req.cookies.JWT,
      req.headers.authorization
    );
    if (authResult === "PASSWORD")
      res.status(400).json({ message: "Invalid Login Credentials (CODE 43183)" });
    else if (authResult === "USER")
      res.status(400).json({ message: "Invalid Login Credentials  (CODE FD14S)" });
    else if (authResult.username === undefined)
      res.status(400).json({ message: "Sorry you are not logged in (ERR 323SW111)" });
    else next();
  } catch (err) {
    res.status(400).json({ message: "Sorry you are not logged in (ERR 22IK8)" });
  }
};

const testing = process.env.MYSQL_PW
console.log("checking here", testing)
console.log("port", process.env.PORT)
//? =========================    Controllers    =========================

app.use("/api/session", sessionController);
app.use(isAuth); //! middleware to authenticate before userRoutes & appRoutes
app.use("/api/a3/v1", a3Controller);
app.use("/api/user", userController);
app.use("/api/app", appController);

//? =========================    Routes      =========================

app.listen(PORT, () => {
  console.log(`server app listening at ${PORT}`);
});
