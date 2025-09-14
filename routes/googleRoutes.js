const router = require("express").Router();
const passport = require("../controllers/googleAuth");

router.get(
  "/google/signup",
  passport.authenticate("google-signup", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/signup/callback",
  passport.authenticate("google-signup", {
    failureRedirect: "/signup-failed",
    session: false,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/sign-in`);
  }
);
module.exports = router;
