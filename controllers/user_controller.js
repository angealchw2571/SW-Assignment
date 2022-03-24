const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
// const mysql = require("mysql");
const USERC = require("../libs/userControllerLibs.js");

// const SUPERUSER = "superuser";
// const ADMIN = "admin";
// const USER = "user";
// const userArray = ["superuser", "admin", "user"];

// const isAuth = (roleArr) => (req, res, next) => {
//   if (req.session.role) {
//     for (const r of roleArr) {
//       if (req.session.role === r) {
//         return next();
//       }
//     }
//   }
//   res.status(404).json({ message: "Authentication required" });
// };

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

//* ====================   @      UPDATE PROFILE        ==============================

router.put("/edit/profile/:id", async function (req, res) {
  const { id } = req.params;
  const { name, age } = req.body;
  const newEmail = req.body.email;

  try {
    await USERC.UpdateProfileValues(id, name, age, newEmail);
    res.status(200).json({ message: "Update Profile Success" });
  } catch (err) {
    console.log("error from catching block", err);
    res.status(400).json(err);
  }
});

//* ====================   @      EDIT Status        ==============================
router.put("/edit/status/:id", async function (req, res) {
  const { id } = req.params;
  const newStatus = req.body.status;
  const STATUS = "user_status";
  try {
    const data = await USERC.UpdateUserValues(id, newStatus, STATUS);
    res.status(200).json({ message: "Status Change Successful" });
  } catch (err) {
    console.log("error from catching block", err);
    res.status(400).json(err);
  }
});

//* ====================    @     Reset Password        ==============================

router.post("/edit/reset/:id", async function (req, res) {
  const { id } = req.params;
  const hashPassword = USERC.PasswordHash(req.body.password);
  const RESET_ACTION = "password";

  try {
    const data = await USERC.UpdateUserValues(id, hashPassword, RESET_ACTION);
    res.status(200).json({ message: "Password Reset Successful" });
  } catch (err) {
    console.log("error from catching block", err);
    res.status(400).json(err);
  }
});

//! ====================    @     Update Permissions       ==============================

router.post("/permissions/:id", async function (req, res) {
  const { id } = req.params;
  const role_name = req.body.role_name

  try {
    const username = await USERC.FetchUsername(id)
    const result = await USERC.UpdatePermissions(role_name, username)
console.log("api query done", result)
  
    res.status(200).json({ message: "User permission change successful" });
  } catch (err) {
    console.log("error from catching block", err);
    res.status(400).json(err);
  }
});


//* ======================  @       GET ALL ROLE DATA       ==============================
router.get("/checkroles", async function (req, res) { 
  try {
    const data = await USERC.FetchAllRolesData();
    res.status(200).json(data);
  } catch (error) {
    console.log("error from catch block", error);
  }
});


//! ====================   @      CHECKGROUP SINGLE ID   CHECK THIS AGAIN      ==============================
router.get("/checkrole/:id/:role", async function (req, res) {
  const { role, id } = req.params;
  try {
    const username = await USERC.FetchUsername(id);
    console.log("role", role);
    console.log("username", username);
    const result = await USERC.CheckRole(username, role);
    console.log("result", result);
    if (result) res.status(200).json({ message: "User in this group" });
    else res.status(400).json({ message: "User not in this group" });
  } catch (error) {
    console.log("error from catch block", error);
  }
});
//* ======================   @      CREATE NEW USER       ==============================
router.post("/new", async function (req, res) { 
  const { username, password, role_name } = req.body;
  try {
    const result = await USERC.CreateNewUser(username, password, role_name);
    if (result) {
      const userID = await USERC.FetchID(username);
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

//* ======================   @      GET SPECIFIC USER       ==============================
router.get("/:id", async function (req, res) {  
  const { id } = req.params;

  try {
    const username = await USERC.FetchUsername(id);
    const profileData = await USERC.FetchProfileData(id);
    const roleData = await USERC.RoleFetch(username);
    const userData = await USERC.FindUserDataID(id);
    const result = await USERC.FetchRoleData(roleData[0].role_name);
    const updatedData = { ...profileData, ...result[0], ...userData[0] };
    delete updatedData.password;
    res.status(200).json(updatedData);
  } catch (error) {
    console.log("error from catch block", error);
    res.status(400).json({ message: "User not found" });
  }
});

//* ======================    @     GET ALL USER       ==============================

router.get("/", async function (req, res) { 
  try {
    const data = await USERC.FindAllUser();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================  @       GET SPECIFIC GROUP       ==============================
router.get("/checkgroup/:role", async function (req, res) { 
  const { role } = req.params;
  try {
    const data = await USERC.FetchGroupUsers(role);
    res.status(200).json(data);
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

module.exports = router;
