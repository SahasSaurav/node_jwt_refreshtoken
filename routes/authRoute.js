const { Router } = require("express");
const { registerUser,loginUser } = require("../controller/authController");

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
// router.route("/refresh_token").post();
// router.route("/logout").delete();

module.exports = router;
