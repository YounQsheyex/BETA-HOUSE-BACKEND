const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const USER = require("../models/userModel");
require("dotenv").config();
const generateToken = require("../helpers/generateToken");
const { sendWelcomeEmail } = require("../emails/sendEmails");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExist = await USER.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: `User with ${email} Already Exist` });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ meaage: "Password must be at least 6 charaters" });
    }
    if (password.length > 12) {
      return res
        .status(400)
        .json({ message: "Password cannot exceed 12 character" });
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const verificationToken = generateToken();
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    const user = await USER.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpires,
    });

    const clientUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendWelcomeEmail({
      email: user.email,
      firstName: user.firstName,
      clientUrl,
    });
    res.status(201).json({
      success: true,
      message: "User Registerd Succesfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleVerifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    ///1. find user by token
    const user = await USER.findOne({
      verificationToken: token,
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }
    //2. check if token has expired
    if (user.verificationTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "verification token has expired", email: user.email });
    }
    //3. check if user is already verifief
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }
    //mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//login User

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await USER.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `Email Address not Found Please Register` });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect Email or Password" });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Email Not verified, Check your mail" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Welcome To BEATAHOUSE",
      token,
      user: {
        email: user.email,
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, userLogin, handleVerifyEmail };
