const mongoose = require("mongoose");

const ChatBotSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ChatBot", ChatBotSchema, "ChatBot");
