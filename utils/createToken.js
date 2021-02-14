const jwt = require("jsonwebtoken");
const client = require("./redis");

const createAccessToken = (userId) => {
  return new Promise((reslove, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1m",
      audience: userId.toString(),
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error(err.message);
        reject(new Error("InternalServerError"));
        return;
      }
      reslove(token);
    });
  });
};

const createRefreshToken = (userId) => {
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
        reject(new Error("InternalServerError"));
      }

      client.set(String(userId), token, "EX", 24 * 60 * 60, (err, reply) => {
        if (err) {
          console.log(err.message);
          reject(new Error("InternalServerError"));
          return;
        }
        reslove(token);
      });
    });
  });
};

const verifyRefreshToken = (refreshToken, res) => {
  return new Promise((reslove, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          res.status(401);
          return reject(new Error("Unauthorized"));
        }
        const userId = payload.aud;
        client.get(userId.toString(), (error, result) => {
          if (error) {
            console.error(error.message);
            res.status(401);
            reject(new Error("InternalServerError"));
            return;
          }
          if (refreshToken === result) {
            return reslove(userId);
          } else {
            res.status(401);
            return reject(new Error("Unauthorized"));
          }
        });
      }
    );
  });
};

const createForgotPasswordToken = ( id,email, password) => {
  return new Promise((reslove, reject) => {
    const payload = {
      id,
      email,
    };
    const secret = process.env.FORGOT_PASSWORD_TOKEN_SECRET + password;
    const options = { expiresIn: "15m" };
    const token = jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error(err.message);
        reject(new Error("InternalServerError"));
        return;
      }
      reslove(token);
    });
  });
};

module.exports = { createAccessToken, createRefreshToken, verifyRefreshToken,createForgotPasswordToken };
