require("dotenv").config();
const jwt = require("jwt-simple");
const secret = process.env.SESSION_SECRET;
const USERC = require("./userControllerLibs.js");

const signJWT = (userDetails) => {
  const payload = {
    user_id: userDetails.user_id,
    username: userDetails.username,
    user_status: userDetails.user_status,
  };
  const token = jwt.encode(payload, secret);
  return token;
};

const validateJWT = async (token) => {
  try {
    const result = await jwt.decode(`${token}`, secret);
    const userData = await USERC.FindUserData(result.username);
    if (userData[0].user_status === 0) {
      return false;
    } else if (
      userData[0].user_id === result.user_id &&
      userData[0].user_status === result.user_status &&
      userData[0].username === result.username
    ) {
      return result;
    }
  } catch (err) {
    console.log("jwt err", err);
    return false;
  }
};

module.exports = { signJWT, validateJWT };
