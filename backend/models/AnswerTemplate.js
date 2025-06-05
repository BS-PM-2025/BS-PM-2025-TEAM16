const mongoose = require("mongoose");

const answerTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "AnswerTemplate",
  answerTemplateSchema,
  "AnswerTemplates"
);
