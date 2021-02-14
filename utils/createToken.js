const jwt = require("jsonwebtoken");

const signAccessToken = (userId) => {
  return new Promise((reslove, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1m",
      audience: userId.toString(),
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject('InternalServerError');
        return;
      }
      reslove(token);
    });
  });
};

module.exports={signAccessToken}