require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 6800;
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const propertyRoute = require("./routes/propertyRoute");
const passport = require("passport");
require("./controllers/googleAuth");
const googleRoutes = require("./routes/googleRoutes");

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "BETAHOUSE SERVER" });
});

app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoute);
app.use("/auth", googleRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "ROUTE NOT FOUND" });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "BETAHOUSE" });
    app.listen(PORT, () => {
      console.log(`App Running on Port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
