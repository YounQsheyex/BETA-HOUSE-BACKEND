const router = require("express").Router();
const { registerUser, userLogin ,handleVerifyEmail} = require("../controllers/authController");

router.post("/sign-up", registerUser);
router.post("/sign-in", userLogin);
router.post("/verify-email/:token", handleVerifyEmail)

module.exports = router;
