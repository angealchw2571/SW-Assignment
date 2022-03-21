const express = require("express");
const router = express.Router();
const USERC = require("../libs/userControllerLibs.js");

//! ==========================         LOGIN        ==============================

router.post("/login", async function (req, res) {
  const { username, password } = req.body;

  try {
    const result = await USERC.FindUserData(username);
    console.log("resultttt", result);
    if (result) {
      const userData = await USERC.CheckPassword(username, password)
      .then((result) => USERC.FindUserData(username));
      req.session.loginUser = userData
      req.session.role = userData.role
      res.status(200).json(userData);
    } else if (result[0] === undefined) {
      res.status(400).json({ message: "user not found" });
    }
  } catch (err) {
    console.log("err", err)
    res.status(404).json({ message: "password incorrect" });
  }
});

//! ==========================         LOGOUT        ==============================

router.delete("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "session destroyed" });
  });
});

module.exports = router;
