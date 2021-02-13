const jwt = require("jsonwebtoken");

const signAccessToken = (userid) => {
  return new Promise((reslove, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "0.5hrs",
      auidence: userid,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err);
        reject();
        return;
      }
      reslove(token);
    });
  });
};

module.exports={signAccessToken}