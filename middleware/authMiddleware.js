const jwt = require("jsonwebtoken");
const User = require("../model/User");

const requireAuth = async (req, res, next) => {
  // here verifying the access token
  try {
    if (!req.headers["authorization"]) {
      res.status(403);
      throw new Error("Not authorized token failed");
    }
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          const message =
            err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
          res.status(403);
          throw new Error(message);
        }
        return payload.aud;
      }
    );
    req.user = await User.findById(decoded).select(
      "-password -createdAt -updatedAt"
    );
    next();
  } catch (err) {
    next(err);
  }
};

const admin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requireAuth,
  admin,
};
