const bcrypt = require("bcrypt");
const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PW,
  database: "user_management_db",
});

const query = util.promisify(connection.query).bind(connection);

function CheckPassword(username, password) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT password from users WHERE username = ?",
      [username],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          const dbPassword = result[0]?.password;
          bcrypt.compare(password, dbPassword, function (error, result) {
            if (result) {
              console.log("password check passed");
              return resolve(result);
            } else {
              console.log("password check failed");
              return resolve(false);
            }
          });
        }
      }
    );
  });
}

function FindUserData(username) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE username = ?;",
      [username],
      (err, result) => {
        if (err) {
          return reject(err);
        } else if (result[0] === undefined) {
          console.log("user not found");
          return resolve(false);
        } else {
          console.log("user found");
          return resolve(result);
        }
      }
    );
  });
}

function FindUserDataID(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE user_id = ?;",
      [id],
      (err, result) => {
        if (err) {
          return reject(err);
        } else if (result[0] === undefined) {
          console.log("user not found");
          return resolve({ message: "User not found" });
        } else {
          console.log("user found");
          return resolve(result[0]);
        }
      }
    );
  });
}

function FindAllUser() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM users;", (err, result) => {
      if (err) {
        return reject(err);
      } else {
        console.log("all user found");
        return resolve(result);
      }
    });
  });
}

function CreateNewUser(username, password) {
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO users (username, password) VALUES (?, ?);",
      [username, hashPassword],
      (err) => {
        if (err) return reject(false);
        else {
          console.log("User created successfully");
          return resolve(true);
        }
      }
    );
  });
}

function EditPassword(newPassword, id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE users SET password = ? WHERE user_id = ?",
      [newPassword, id],
      (err, result) => {
        if (err) return reject(false);
        else if (result) {
          console.log(`Change password success for user_id ${id}`);
          return resolve(result);
        }
      }
    );
  });
}

function CheckGroupID(user_id, role) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM users", (err, result) => {
      if (err) return resolve(false);
      else if (result) {
        console.log("checkgroup working", result);
        return resolve(true);
      }
    });
  });
}

module.exports = {
  CheckPassword,
  FindUserData,
  CreateNewUser,
  FindUserDataID,
  FindAllUser,
  EditPassword,
  CheckGroupID,
};
