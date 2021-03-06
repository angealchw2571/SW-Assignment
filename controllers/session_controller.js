const express = require("express");
const router = express.Router();
const USERC = require("../libs/userControllerLibs.js");
const JWTFunction = require("../libs/jwtLib");

//! ==========================    @     LOGIN        ==============================

router.post("/login", async function (req, res) {
  const { username, password } = req.body;
  try {
    const result = await USERC.FindUserData(username);
    if (result) {
      const passwordCheck = await USERC.CheckPassword(username, password);
      if (passwordCheck) {
        const userData = await USERC.FindUserData(username);
        const roleData = await USERC.RoleGroupFetch(userData[0].username);
        const assignedTeams = await USERC.FetchGroupDetails(username);
        const package = {
          ...userData[0],
          ...result[0],
          ...roleData[0],
          ...assignedTeams[0],
        };
        delete package.password;
        req.session.loginUser = package;
        req.session.teams = assignedTeams[0].group_name;
        res.cookie("JWT", JWTFunction.signJWT(package));
        res.status(200).json(package);
      } else res.status(400).json({ message: "Password Incorrect" });
    } else if (result[0] === undefined) {
      res.status(400).json({ message: "Username not found" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(404).json(err);
  }
});

//! ==========================         LOGOUT        ==============================

router.delete("/logout", (req, res) => {
  res.clearCookie("JWT", { path: "/", domain: "localhost", maxAge: 0 });
  req.session.destroy(() => {
    res.status(200).json({ message: "session destroyed" });
  });
});

module.exports = router;
