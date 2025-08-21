const router = require("express").Router();
const { registerUser, userLogin } = require("../controllers/authController");

router.post("/sign-up", registerUser);
router.post("/sign-in", userLogin);

module.exports = router;
