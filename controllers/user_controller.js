const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const USERC = require("../libs/userControllerLibs.js");
const JWTFunction = require("../libs/jwtLib");

// const mysql = require("mysql");

const isAdmin = async (req, res, next) => {
  try {
    const authResult = await authorisationFunc(
      req.cookies.JWT,
      req.headers.authorization
    );
    if (authResult) {
      const roleGroup = await USERC.RoleGroupFetch(authResult.username);
      const checkRoleResult = await USERC.CheckRole(
        roleGroup[0].role_groups,
        "Admin"
      );
      if (checkRoleResult) {
        next();
      } else {
        res.status(400).json({
          message: "Sorry you are not authorised to perform this action ",
        });
      }
    } else {
      res
        .status(400)
        .json({
          message: "Sorry you are not authorised to perform this action",
        });
    }
  } catch (err) {
    console.log("isAdmin err", err);
    res
      .status(400)
      .json({ message: "Sorry you are not authorised to perform this action" });
  }

};

const authorisationFunc = async (JWT, authheader) => {
  if (JWT) {
    const result = JWTFunction.validateJWT(JWT);
    return result;
  } else if (authheader) {
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
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

//* ====================   @      EDIT PASSWORD       =============================
router.put("/edit/pass/:id", async function (req, res) {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.password;
  const hashNewPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
  const { id } = req.params;

  try {
    const result = await USERC.FetchUsername(id);
    const checkResult = await USERC.CheckPassword(result, currentPassword);
    if (checkResult) {
      const data = await USERC.EditPassword(hashNewPassword, id);
      res.status(200).json({ message: "Successfully changed password" });
    } else {
      res.status(400).json({ message: "Current Password incorrect" });
    }
  } catch (err) {
    console.log("error from catching block", err);
  }
});

//* ====================   @      EDIT Status        ==============================
router.put("/edit/:id", async function (req, res) {
  const { id } = req.params;
  const { name, email, role_groups, groupName, status } = req.body;

  try {
    const updateStatus = await USERC.UpdateUserValues(
      id,
      status,
      "user_status"
    );
    if (updateStatus) {
      const updateProfile = await USERC.UpdateProfileValues(id, name, email);
      if (updateProfile) {
        const username = await USERC.FetchUsername(id);
        const updatePermission = await USERC.UpdatePermissions(
          role_groups,
          username
        );
        if (updatePermission) {
          const updateGroup = await USERC.UpdateGroupTeamsAssignment(
            username,
            groupName
          );
          if (updateGroup) {
            res.status(200).json({ message: "User update successful" });
          }
        }
      }
    }
  } catch (err) {
    console.log("error from catching block", err);
    res.status(400).json(err);
  }
});
//* ====================    @     Reset Password        ==============================

router.post("/edit/reset/:id", async function (req, res) {
  const { id } = req.params;
  const hashPassword = USERC.PasswordHash("123456Aa$!");
  const RESET_ACTION = "password";

  try {
    const data = await USERC.UpdateUserValues(id, hashPassword, RESET_ACTION);
    res.status(200).json({
      message: "Password Reset Successful. New password is 123456Aa$!",
    });
  } catch (err) {
    console.log("error from catching block", err);
    res.status(400).json(err);
  }
});

//

//* ======================  @       GET ALL ROLE DATA       ==============================
router.get("/checkroles", async function (req, res) {
  try {
    const data = await USERC.FetchAllRolesData();
    res.status(200).json(data);
  } catch (error) {
    console.log("error from catch block", error);
  }
});

//* ====================   @      CHECKGROUP SINGLE ID   CHECK THIS AGAIN      ==============================
router.get("/checkrole/:id/:roleName", async function (req, res) {
  const { roleName, id } = req.params;
  try {
    const username = await USERC.FetchUsername(id);
    const roleGroup = await USERC.RoleGroupFetch(username);
    const result = await USERC.CheckRole(roleGroup[0].role_groups, roleName);
    if (result) res.status(200).json({ message: "User in this group" });
    else res.status(400).json({ message: "User not in this group" });
  } catch (error) {
    console.log("error from catch block", error);
  }
});

//* ======================   @      CREATE NEW ROLE       ==============================
router.post("/newrole", async function (req, res) {
  const { role_name, role_description } = req.body;
  try {
    await USERC.CreateNewRole(role_name, role_description);
    res.status(200).json({ message: "New Role Created Successfully" });
  } catch (error) {
    console.log("error from catch blockkkk", error);
  }
});

//* ======================   @      CREATE NEW USER       ==============================
router.post("/new", async function (req, res) {
  const { username, password, role_groups, groupName } = req.body;
  try {
    const result = await USERC.CreateNewUser(username, password, role_groups);
    if (result) {
      const userID = await USERC.FetchID(username);
      await USERC.AddGroupTeamsAssignment(username, groupName);
      const finalResult = await USERC.CreateNewProfile(userID, username);
      if (finalResult) {
        res.status(200).json({ message: "User Created Successfully" });
      } else {
        res.status(400).json({ message: "Failed to create user" });
      }
    }
  } catch (error) {
    console.log("error from catch blockkkk", error);
  }
});

//* ======================    @     GET ALL GROUPS        ==============================
router.get("/groups", async function (req, res) {
  try {
    const data = await USERC.FetchAllGroups();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});
//* ======================   @      GET SPECIFIC USER       ==============================
router.get("/:id", async function (req, res) {
  const { id } = req.params;

  try {
    const username = await USERC.FetchUsername(id);
    const profileData = await USERC.FetchProfileData(id);
    const groupData = await USERC.FetchGroupDetails(username);
    const groupDetails = await USERC.FetchGroupTableDetails(
      groupData[0].group_name
    );
    const roleData = await USERC.RoleGroupFetch(username);
    const userData = await USERC.FindUserDataID(id);
    const updatedData = {
      ...profileData,
      ...userData[0],
      ...roleData[0],
      ...groupDetails[0],
    };
    delete updatedData.password;
    console.log("updatedData L192", updatedData);
    res.status(200).json(updatedData);
  } catch (error) {
    console.log("error from catch block", error);
    res.status(400).json({ message: "User not found" });
  }
});

//* ======================    @     GET ALL USER       ==============================
router.get("/", isAdmin, async function (req, res) {
  try {
    const data = await USERC.FindAllUser();
    res.status(200).json(data);
  } catch (err) {
    console.log("err", err);
    res.status(400).json(err);
  }
});

//* ======================  @       GET SPECIFIC GROUP       ==============================
router.get("/checkgroup/:roleName", async function (req, res) {
  const { roleName } = req.params;
  let package = [];
  try {
    const allUsers = await USERC.FindAllUser();
    for (let i = 0; i < allUsers.length; i++) {
      const username = await USERC.FetchUsername(allUsers[i].user_id);
      const roleGroup = await USERC.RoleGroupFetch(username);
      const result = await USERC.CheckRole(roleGroup[0].role_groups, roleName);
      if (result === true) {
        package.push(allUsers[i]);
      }
    }
    res.status(200).json(package);
  } catch (error) {
    console.log("error from catch block", error);
  }
});

//* ======================  @       GET SPECIFIC GROUP       ==============================
router.get("/checkgroup2/:groupName", async function (req, res) {
  const { groupName } = req.params;
  let package = [];
  try {
    const allUsers = await USERC.FindAllUser();
    const usersWithGroupName = await USERC.FetchAllUsersWithGroup(groupName);
    for (let i = 0; i < allUsers.length; i++) {
      for (let x = 0; x < usersWithGroupName.length; x++) {
        if (usersWithGroupName[x].username === allUsers[i].username) {
          package.push(allUsers[i]);
        }
      }
    }
    console.log("package", package);
    res.status(200).json(package);
  } catch (error) {
    console.log("error from catch block", error);
  }
});

//! ======================         Test       ==============================

// router.get("/test/:id/", async function (req, res) {
//   const { id } = req.params;

//   try {
//     const roleData = await USERC.RoleFetch(id);
//     const result = await USERC.FetchRoleData(roleData[0].role);
//     console.log("here2", result[0]);

//     res.status(200).json(result[0]);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

//! ====================         EDIT EMAIL & STATUS        ==============================

router.put("/edit/:ACTION/:ID", function (req, res) {
  const { ID, ACTION } = req.params;

  if (ACTION === "email") {
    const newEmail = req.body.email;
    const sqlQuery = `UPDATE users SET email = '${newEmail}' WHERE user_id = '${ID}'`;
    connection.query(sqlQuery, (err, result) => {
      if (err) res.status(400).json({ error: err.message });
      else {
        console.log("Change email success");
        res.status(200).json(result);
      }
    });
  } else if (ACTION === "status") {
    const newStatus = req.body.status;
    const sqlQuery = `UPDATE users SET status = '${newStatus}' WHERE user_id = '${ID}'`;
    connection.query(sqlQuery, (err, result) => {
      if (err) res.status(400).json({ error: err.message });
      else {
        console.log("Change status success");
        res.status(200).json(result);
      }
    });
  } else if (ACTION === "reset") {
    const newPassword = req.body.password;
    const hashNewPassword = bcrypt.hashSync(
      newPassword,
      bcrypt.genSaltSync(10)
    );
    const sqlQuery = `UPDATE users SET password = '${hashNewPassword}' WHERE user_id = '${ID}'`;
    connection.query(sqlQuery, (err, result) => {
      if (err) res.status(400).json({ error: err.message });
      else {
        console.log("reset password success");
        res.status(200).json(result);
      }
    });
  }
});

//* ====================    @     Update Permissions       ==============================

// router.post("/permissions/:id", async function (req, res) {
//   const { id } = req.params;
//   const { role_groups, groupName } = req.body;

//   try {
//     const username = await USERC.FetchUsername(id);
//     const result = await USERC.UpdatePermissions(role_groups, username);
//     const result2 = await USERC.UpdateGroupTeamsAssignment(username, groupName);
//     if (result2) {
//       res.status(200).json({ message: "User permission change successful" });
//     }
//   } catch (err) {
//     console.log("error from catching block", err);
//     res.status(400).json(err);
//   }
// });

//* ====================   @      UPDATE PROFILE        ==============================

// router.put("/edit/profile/:id", async function (req, res) {
//   const { id } = req.params;
//   const { name, age } = req.body;
//   const newEmail = req.body.email;

//   try {
//     await USERC.UpdateProfileValues(id, name, age, newEmail);
//     res.status(200).json({ message: "Update Profile Success" });
//   } catch (err) {
//     console.log("error from catching block", err);
//     res.status(400).json(err);
//   }
// });

// //* ====================   @      EDIT Status        ==============================
// router.put("/edit/status/:id", async function (req, res) {
//   const { id } = req.params;
//   const newStatus = req.body.status;
//   const STATUS = "user_status";
//   try {
//     const data = await USERC.UpdateUserValues(id, newStatus, STATUS);
//     res.status(200).json({ message: "Status Change Successful" });
//   } catch (err) {
//     console.log("error from catching block", err);
//     res.status(400).json(err);
//   }
// });

module.exports = router;
