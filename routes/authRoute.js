const { Router } = require("express");
const { registerUser } = require("../controller/authController");

const router = Router();

router.route("/register").post(registerUser);
// router.route("/login").post();
// router.route("/refresh_token").post();
// router.route("/logout").delete();

module.exports = router;
