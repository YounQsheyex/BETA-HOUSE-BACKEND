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
      required: function () {
        // password required only if provider is not google
        return this.provider !== "google";
      },
      minlength: [6, "Password must be at least 6 characters"],
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
  },
  { timestamps: true }
);
const USER = mongoose.model("users", registerUser);
module.exports = USER;
