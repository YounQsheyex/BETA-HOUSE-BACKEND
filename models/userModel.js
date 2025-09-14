const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const registerUser = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Enter Your First Name"],
    },
    lastName: {
      type: String,
      required: [true, "Please Enter Your Last Name"],
    },
    email: {
      type: String,
      required: [true, "Email Address is Required"],
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    isVerified: {
      type: Boolean,
      default:false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
  },
  { timestamps: true }
);
const USER = mongoose.model("users", registerUser);
module.exports = USER;
