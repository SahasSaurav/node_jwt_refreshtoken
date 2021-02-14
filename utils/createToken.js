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

const verifyRefreshToken=(refreshToken)=>{
  return  new Promise((reslove,reject)=>{
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
      if(err){
        res.status(401)
        return reject('Unauthorized')
      }
      const userId=payload.aud

      reslove(userId)
    }) 
  })
}

module.exports = { signAccessToken, signRefreshToken,verifyRefreshToken };
