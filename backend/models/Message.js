const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
}, { timestamps: true }); 
module.exports = mongoose.model("Message", messageSchema);