const User = require("../model/User");
const {
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require("../utils/validationSchema");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  createForgotPasswordToken,
  verifyForgotPassword
} = require("../utils/createToken");
const client = require("../utils/redis");

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
    const accessToken = await createAccessToken(user._id);
    const refreshToken = await createRefreshToken(user._id);
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
    const accessToken = await createAccessToken(user._id);
    const refreshToken = await createRefreshToken(user._id);
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

const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error("Bad request");
      return;
    }
    const userId = await verifyRefreshToken(refreshToken, res);
    const accessToken = await createnAccessToken(userId);
    const refToken = await createRefreshToken(userId);
    res.json({ accessToken, refreshToken: refToken });
  } catch (err) {
    next(err);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error("Bad Request");
    }
    const userId = await verifyRefreshToken(refreshToken, res);
    client.del(userId, (err, value) => {
      if (err) {
        console.error(err.message);
        res.status(500);
        throw new Error("InternalServerError");
      }
      res.sendStatus(204);
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordSchema.validateAsync({ email });

    const user = await User.findOne({ email: result.email });
    if (!user) {
      res.status(400);
      throw new Error("User is not registered");
      return;
    }
    const token = await createForgotPasswordToken(
      user.id.toString(),
      user.email,
      user.password
    );
    const resetPasswordLink = `${req.protocol}://${req.get(
      "host"
    )}/auth/reset-password/${user.id.toString()}/${token}`;
    console.log({ resetPasswordLink });
    //send email to user with resetPasswordLink
    res.json({
      message: "'Password reset link has been sent to your email",
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const {id,token}=req.params;
    const {password,repeatPassword}=req.body
    const result=await resetPasswordSchema.validateAsync({password,repeatPassword});
    const user=await User.findById({_id:id})
    if(id!==user.id){
      res.status(401)
      throw new Error('Unauthorized')
    }
    const payload=await verifyForgotPassword(token,user.password,res)
    const isUserExist=await User.findOne({_id:payload.id,email:payload.email})
    if(isUserExist){
      isUserExist.password=password;
      await isUserExist.save()
      res.status(201)
      res.json({message:"Sucsessfully changed the password"})
    }else{
      res.status(401)
      throw new Error('unAuthorized')
    }
  } catch (err) {
    if (err.isJoi === true) res.status(400);
    next(err)
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};
