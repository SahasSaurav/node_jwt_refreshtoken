const User = require("../model/User");
const {
  registerUserSchema,
  loginUserSchema,
} = require("../utils/validationSchema");
const { signAccessToken, signRefreshToken } = require("../utils/createToken");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await registerUserSchema.validateAsync({
      name,
      email,
      password,
    });
    const userDoesExist = await User.findOne({ email: result.email });
    //checking whether user already registered with this email id or not
    if (userDoesExist) {
      res.status(401);
      throw new Error("Another user already exist with this email ");
    }
    const user = await User.create({ name, email, password });
    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (err) {
    if (err.isJoi === true) {
      res.status(422); //Unprocessable Entity  error code 422
    }
    console.log(err);
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserSchema.validateAsync({ email, password });
    //whether email exist in db
    const user = await User.findOne({ email: result.email });
    if (!user) {
      res.status(400);
      throw new Error("User is not registered");
    }
    //whether the entered password match with password stored in db
    const isMatch = await user.isValidPassword(result.password);
    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);
    if (user && isMatch) {
      res.json({
        _id: user._id,
        nmae: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(401);
      throw new Error("Invalid user credentials");
    }
  } catch (err) {
    if (err.isJoi === true) res.status(400);
    next(err);
  }
};

module.exports = { registerUser, loginUser };
