const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const USER = require("../models/userModel");
const generateToken = require("../helpers/generateToken");
const { sendWelcomeEmail } = require("../emails/sendEmails");

// === Google Signup Strategy ===
passport.use(
  "google-signup",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://beta-house-backend-ywp5.onrender.com/auth/google/signup/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await USER.findOne({ email });
        if (user) {
          return done(null, false, {
            message: "User already exists. Please login.",
          });
        }

        const verificationToken = generateToken();
        const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

        user = await USER.create({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email,
          password: "google-oauth",
          verificationToken,
          verificationTokenExpires,
          provider: "google",
          isVerified: false,
        });

        const clientUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        await sendWelcomeEmail({
          firstName: profile.name.givenName,
          email,
          clientUrl,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);


module.exports=passport