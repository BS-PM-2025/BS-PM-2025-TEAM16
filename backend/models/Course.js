const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  lecturer: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  department: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Course", courseSchema, "courses");
