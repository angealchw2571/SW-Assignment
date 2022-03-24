const bcrypt = require("bcrypt");
const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PW,
  database: "assignment_db",
});

// const query = util.promisify(connection.query).bind(connection);
//! =============================      returns true/false    =============================
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

//! =============================      fetch userData with id    =============================
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
          return resolve(false);
        } else {
          console.log("user found");
          return resolve(result);
        }
      }
    );
  });
}
//! =============================        for login       =============================
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

//! =============================  fetch profile details with id   =============================
function FetchProfileData(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM profiles WHERE user_id = ?;",
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

//! =============================       Fetch details from all tables    =============================
function FindAllUser() {
  const sqlQuery = `SELECT
    users.user_id,
    users.username,
    users.user_status,
    name,
    age,
    email,
    role_id,
    roles.role_name,
    role_description
    FROM profiles, permissions, roles, users 
    WHERE users.username = permissions.username
    AND permissions.role_name = roles.role_name 
    AND users.username = profiles.username AND permission_status= '1';`;

  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        console.log("all users found");
        return resolve(result);
      }
    });
  });
}

//! =============================     create new user    =============================
function CreateNewUser(username, password, role_name, user_id) {
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const sqlQuery = `
  INSERT INTO users (username, password) VALUES (?,?)
  `;
  const sqlQuery2 = `
  INSERT INTO permissions (role_name, username) VALUES (?,?)
  `;
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [username, hashPassword], (err) => {
      if (err) {
        console.log("error", err);
        return reject(false);
      } else {
        connection.query(sqlQuery2, [role_name, username], (err) => {
          if (err) {
            console.log("error", err);
            return reject(false);
          } else {
            console.log("User Created Successfully");
            return resolve(true);
          }
        });
      }
    });
  });
}

//? Relook this and edit password
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

//!  ==================================          Create new profile         =============================

function CreateNewProfile(user_id, username) {
  const sqlQuery = `
  INSERT INTO profiles (name, age, email, user_id, username) 
  VALUES ( 'nil', '0', 'nil', ?, ?)
  `;
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [user_id, username], (err, result) => {
      if (err) {
        console.log("error", err);
        return reject(false);
      } else {
        console.log("checkgroup working", result);
        return resolve(true);
      }
    });
  });
}

//!  ==================================          FIX THIS         =============================
//* Check whether certain user is still in certain group, returns true/false
function CheckRole(username, role_name) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM permissions WHERE username = ? AND permission_status = '1' AND role_name = ?;",
      [username, role_name],
      (err, result) => {
        if (result[0] === undefined) return resolve(false);
        else {
          return resolve(true);
        }
      }
    );
  });
}

//! =============================         fetch role from roles table      ========================
function RoleFetch(username) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT role_name FROM permissions WHERE username = ? && permission_status ='1' ;",
      [username],
      (err, result) => {
        if (err) return reject(err);
        else if (result) {
          return resolve(result); //! returns role_id
        }
      }
    );
  });
}

//! =============================      fetch role details      =============================
function FetchRoleData(role_name) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM roles WHERE role_name = ? ;",
      [role_name],
      (err, result) => {
        if (err) return reject(err);
        else if (result) {
          return resolve(result); //! returns role_name, role_description
        }
      }
    );
  });
}

//! =============================        fetch all users from a certain group      =============================
function FetchGroupUsers(role_name) {
  const sqlQuery = `SELECT 
  users.user_id, 
  users.username,
  users.user_status,
  name, 
  age, 
  email, 
  roles.role_name, 
  role_description
  FROM profiles, permissions, roles, users 
  WHERE users.username = permissions.username 
  AND permissions.role_name = roles.role_name 
  AND users.username = profiles.username 
  AND roles.role_name = ? AND permission_status = '1';`;

  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [role_name], (err, result) => {
      if (err) return reject(err);
      else if (result) {
        return resolve(result);
      }
    });
  });
}

function UpdateProfileValues(id, name, age, email) {
  const sqlQuery = `UPDATE profiles 
  SET name = ?, 
  age = ?, 
  email = ? 
  where user_id = ?;`;
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [name, age, email, id], (err, result) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        console.log("Updated Profile Values");
        resolve(result);
      }
    });
  });
}
function UpdateUserValues(id, value, action) {
  const sqlQuery = `UPDATE users SET ${action} = ? where user_id = ?;`;
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [value, id], (err, result) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function PasswordHash(password) {
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return hashPassword;
}

function FetchUsername(id) {
  const sqlQuery = `SELECT username FROM users WHERE user_id = ?;
  `;
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [id], (err, result) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        resolve(result[0].username);
      }
    });
  });
}

function FetchID(username) {
  const sqlQuery = `SELECT user_id FROM users WHERE username = ?;
  `;
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [username], (err, result) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        resolve(result[0].user_id);
      }
    });
  });
}

function FetchAllRolesData() {
  const sqlQuery = `SELECT * FROM roles;
  `;
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, result) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function UpdatePermissions(role_name, username) {
  const sqlQuery = `UPDATE permissions SET permission_status = '0' WHERE username = ?;`;
  const sqlQuery2 = `INSERT INTO permissions (role_name, username) VALUES ( ? , ? );`;
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [username], (err, result) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        console.log("update permission status success");

        connection.query(sqlQuery2, [role_name, username], (err, result) => {
          if (err) {
            console.log("error", err);
            reject(err);
          } else {
            console.log("added new permission success")
            resolve(result);
          }
        });
      }
    });
  });
}

module.exports = {
  CheckPassword,
  FindUserData,
  FindUserDataID,
  CreateNewUser,
  FetchProfileData,
  FindAllUser,
  EditPassword,
  CheckRole,
  RoleFetch,
  FetchRoleData,
  FetchGroupUsers,
  UpdateProfileValues,
  UpdateUserValues,
  PasswordHash,
  FetchUsername,
  FetchID,
  CreateNewProfile,
  FetchAllRolesData,
  UpdatePermissions,
};
