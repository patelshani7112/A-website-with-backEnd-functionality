const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    default: "default",
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    default: "default",
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: String,
    default: false,
  },
  userType: {
    type: String,
    default: "User",
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
