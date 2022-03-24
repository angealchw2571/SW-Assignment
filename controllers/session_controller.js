const express = require("express");
const router = express.Router();
const USERC = require("../libs/userControllerLibs.js");

//! ==========================    @     LOGIN        ==============================

router.post("/login", async function (req, res) {
  const { username, password } = req.body;

  try {
    const result = await USERC.FindUserData(username);
    if (result) {
      const passwordCheck = await USERC.CheckPassword(username, password);

      if (passwordCheck) {
        const userData = await USERC.FindUserData(username);
        const roleData = await USERC.RoleFetch(userData[0].username);
        const FetchRoleData = await USERC.FetchRoleData(roleData[0].role_name);
        const package = { ...userData[0], ...result[0], ...FetchRoleData[0] };
        delete package.password;
        req.session.loginUser = package;
        req.session.role = package.role_name;
        res.status(200).json(package);
      } else res.status(400).json({ message: "Password Incorrect" });
    } else if (result[0] === undefined) {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(404).json(err);
  }
});

//! ==========================         LOGOUT        ==============================

router.delete("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "session destroyed" });
  });
});

module.exports = router;
