const router = require("express").Router();
const passport = require("../controllers/googleAuth");
const jwt = require("jsonwebtoken");

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
    failureRedirect: `${process.env.FRONTEND_URL}/sign-in`,
    session: false,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/sign-in`);
  }
);

// login routes
router.get(
  "/google/login",
  passport.authenticate("google-login", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Callback for login
router.get(
  "/google/login/callback",
  passport.authenticate("google-login", {
    failureRedirect: `${process.env.FRONTEND_URL}/sign-up`,
    session: false,
  }),

  (req, res) => {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/sign-up`);
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Redirect to frontend after successful login
    res
      .status(200)
      .redirect(`${process.env.FRONTEND_URL}/home`)
      .json({
        success: true,
        message: "Successful",
        user: {
          token,
          userId: user._id,
          email: user.email,
        },
      });
  }
);
module.exports = router;
