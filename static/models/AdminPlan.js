const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
  },
  planPrice1: {
    type: Number,
    required: true,
  },
  planPrice12: {
    type: Number,
    required: true,
  },
  planPrice24: {
    type: Number,
    required: true,
  },
  planPrice36: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
