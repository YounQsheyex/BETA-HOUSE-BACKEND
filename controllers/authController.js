const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const USER = require("../models/userModel");
require("dotenv").config();

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExist = await USER.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: `User with ${email} Already Exist` });
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new USER({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

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
    await user.save();
    res.status(201).json({
      success: true,
      message: "User Registerd Succesfully",
      user: {
        firstName,
        lastName,
        email,
      },
    });
  } catch (error) {
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
        .json({ message: `Email Address not Found Plase Register` });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect Email or Password" });
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

module.exports = { registerUser, userLogin };
