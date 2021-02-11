const User = require("../model/User");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userDoesExist = await User.findOne({ email });
  if (userDoesExist) {
    res.status(400);
    throw new Error("Another user already exist with this email ");
  }
  const user = await User.create({ name, email, password });
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};


module.exports={registerUser}