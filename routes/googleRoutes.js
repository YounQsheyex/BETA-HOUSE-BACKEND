const router = require("express").Router();
const passport=require("../controllers/googleAuth")

router.get(
  "/auth/google/signup",
  passport.authenticate("google-signup", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/signup/callback",
  passport.authenticate("google-signup", { failureRedirect: "/signup-failed" }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/sign-in`);
  }
);
module.exports=router