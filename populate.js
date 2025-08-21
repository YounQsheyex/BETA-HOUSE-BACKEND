require("dotenv").config();
const mongoose = require("mongoose");
const PROPERTY = require("./models/propertyModel");
const properties = require("./property.json");

const populate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "BETAHOUSE" });
    await PROPERTY.deleteMany();
    await PROPERTY.create(properties);
    console.log("properties added");
  } catch (error) {
    console.log(error);
  }
};
populate();
