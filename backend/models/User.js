const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "staff", "admin"],
  },
  position: {
    type: String,
    enum: ["secretary", "lecturer", ""],
  },
  department: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
  },
  startYear: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
