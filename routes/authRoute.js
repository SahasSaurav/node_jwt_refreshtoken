const { Router } = require("express");
const { registerUser,loginUser,refreshAccessToken,logoutUser } = require("../controller/authController");

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").delete(logoutUser);
// router.route('/forgot-password').post()
// router.route('/reset-password/:id/:token').put()

module.exports = router;
