const bcrypt = require("bcrypt");
const mysql = require("mysql");

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

//* =============================      fetch userData with id    =============================
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

//* =============================        for login       =============================
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
          // console.log("user found");
          return resolve(result);
        }
      }
    );
  });
}
//* =============================  fetch profile details with id   =============================
function FetchProfileData(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM profiles WHERE user_id = ?;",
      [id],
      (err, result) => {
        if (err) {
          return reject(err);
        } else if (result[0] === undefined) {
          // console.log("user not found");
          return resolve({ message: "User not found" });
        } else {
          // console.log("user found");
          return resolve(result[0]);
        }
      }
    );
  });
}

//* =============================       Fetch details from all tables    =============================
function FindAllUser() {
  const sqlQuery = `SELECT
    users.user_id,
    users.username,
    users.user_status,
    name,
    age,
    email,
    role_groups,
    groups_table.group_name,
    groups_table.group_color
    FROM profiles, permissions, users, group_teams_assignment, groups_table
    WHERE users.username = permissions.username
    AND users.username = profiles.username 
    AND permission_status= '1'
    AND groups_table.group_name = group_teams_assignment.group_name
    AND users.username = group_teams_assignment.username
    ORDER BY users.user_id;`;

  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        result.map((e)=> {
          e.role_groups = JSON.parse(e.role_groups)
        })
        console.log("all users found");
        return resolve(result);
      }
    });
  });
}

//* =============================     create new user    =============================
function CreateNewUser(username, password, role_groups,) {
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const sqlQuery = `
  INSERT INTO users (username, password) VALUES (?,?)
  `;
  const sqlQuery2 = `
  INSERT INTO permissions (role_groups, username) VALUES (?,?)
  `;
  const JSONroleGroups = JSON.stringify(role_groups)
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [username, hashPassword], (err) => {
      if (err) {
        console.log("error", err);
        return reject(false);
      } else {
        connection.query(sqlQuery2, [JSONroleGroups, username], (err) => {
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

//* =============================     Relook this and edit password    =======================
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

//*  ==================================          Create new profile         =============================
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
        console.log("create new profile success", result);
        return resolve(true);
      }
    });
  });
}

//*  ==================================          FIX THIS         =============================
//* Check whether certain user is still in certain group, returns true/false
function CheckRole(role_groups, role_name) {
  const stringJSON = JSON.stringify(role_groups)
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT JSON_CONTAINS('${stringJSON}','"${role_name}"')`,
      (err, result) => {
        if (err) {
          console.log("error", err)
          return resolve(false);
        }
        else if (result[0][Object.keys(result[0])[0]] === 0){
          return resolve(false)
        }
        else{
          return resolve(true);
        }
      }
    );
  });
}

//! =============================         fetch role from roles table      ========================
// function RoleFetch(username) {
//   return new Promise((resolve, reject) => {
//     connection.query(
//       "SELECT role_groups FROM permissions WHERE username = ? && permission_status ='1' ;",
//       [username],
//       (err, result) => {
//         if (err) return reject(err);
//         else if (result) {
//           result[0].role_groups = JSON.parse(result[0].role_groups)
//           return resolve(result);
//         }
//       }
//     );
//   });
// }

//! =============================         fetch role from roles table with single username     ========================
function RoleGroupFetch(username) {
  // console.log("username", username)
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT role_groups FROM permissions WHERE username = ? && permission_status ='1' ;",
      [username],
      (err, result) => {
        if (err) return reject(err);
        else if (result) {
          result[0].role_groups = JSON.parse(result[0].role_groups);
          return resolve(result);
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

//* =============================        fetch all users from a certain group      =============================
function FetchGroupUsers(role_name) {
  const sqlQuery = `SELECT 
  users.user_id, 
  users.username,
  users.user_status,
  name, 
  age, 
  email, 
  role_groups
  FROM profiles, permissions, users 
  WHERE users.username = permissions.username 
  AND users.username = profiles.username 
  AND permission_status = '1';`;

  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [role_name], (err, result) => {
      if (err) return reject(err);
      else if (result) {
        return resolve(result);
      }
    });
  });
}

function UpdateProfileValues(id, name, email) {
  const sqlQuery = `UPDATE profiles 
  SET name = ?, 
  email = ? 
  WHERE user_id = ?;`;
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [name, email, id], (err, result) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        resolve(true);
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
        resolve(true);
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

function UpdatePermissions(role_groups, username) {
  const parsedJSON = JSON.stringify(role_groups)
  const sqlQuery = `UPDATE permissions SET permission_status = '0' WHERE username = ?;`;
  const sqlQuery2 = `INSERT INTO permissions (role_groups, username) VALUES ( ? , ?);`;
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [username], (err, result) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        connection.query(sqlQuery2, [parsedJSON, username], (err, result) => {
          if (err) {
            console.log("error", err);
            reject(err);
          } else {
            resolve(true);
          }
        });
      }
    });
  });
}

function CreateNewRole(role_name, role_description) {
  const sqlQuery = `INSERT INTO roles (role_name, role_description) VALUES (?,?);`;

  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [role_name, role_description], (err, result) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        console.log("create new role success");
        resolve(result);
      }
    });
  });
}

//* =============================  fetch profile details with id   =============================
function FetchAllGroups() {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM groups_table;",
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      }
    );
  });
}
//* =============================  fetch profile details with id   =============================
function FetchGroupTableDetails(group_name) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM groups_table WHERE group_name = ?;", [group_name],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      }
    );
  });
}

//* =============================  fetch group with username   =============================
function FetchGroupDetails(username) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM group_teams_assignment WHERE username = ?;",
      [username],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      }
    );
  });
}

//! =============================  fetch group with username   =============================
function FetchAllUsersWithGroup(group_name) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM group_teams_assignment WHERE group_name = ?;",
      [group_name],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      }
    );
  });
}

//* =============================  Add new group_teams_assignment   =============================
function AddGroupTeamsAssignment(username, groupName) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO group_teams_assignment(group_name, username) VALUES (?,?);",
      [groupName, username],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      }
    );
  });
}
//* =============================  Update group_teams_assignment   =============================
function UpdateGroupTeamsAssignment(username, groupName) {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE group_teams_assignment SET group_name = ? WHERE username = ?",
      [groupName, username],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(true);
        }
      }
    );
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
  CreateNewRole,
  RoleGroupFetch,
  FetchAllGroups,
  FetchGroupDetails,
  AddGroupTeamsAssignment,
  UpdateGroupTeamsAssignment,
  FetchAllUsersWithGroup,
  FetchGroupTableDetails,
};
