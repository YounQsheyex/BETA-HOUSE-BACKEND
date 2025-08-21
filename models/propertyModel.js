const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creteProperty = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },

  bedrooms: {
    type: String,
    required: true,
  },
  bathroom: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    enum: ["For Rent", "For Sale"],
    default: "For Sale",
  },
  feature: {
    type: String,
    emum: "Featured",
  },
});

const PROPERTY = mongoose.model("properties", creteProperty);
module.exports = PROPERTY;
