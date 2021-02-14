const jwt = require("jsonwebtoken");

const signAccessToken = (userId) => {
  return new Promise((reslove, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "30m",
      audience: userId.toString(),
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error(err.message);
        reject("InternalServerError");
        return;
      }
      reslove(token);
    });
  });
};

const signRefreshToken = (userId) => {
  return new Promise((reslove, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "24h",
      audience: userId.toString(),
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error(err);
        reject("InternalServerError");
        return;
      }
      reslove(token);
    });
  });
};

module.exports = { signAccessToken, signRefreshToken };
