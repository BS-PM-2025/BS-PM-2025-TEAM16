const ChatBot = require("../models/ChatBot");

exports.getQuestions = async (req, res) => {
  try {
    const questions = await ChatBot.find({}, "question");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching questions" });
  }
};

exports.getAnswer = async (req, res) => {
  const { question } = req.body;
  try {
    const match = await ChatBot.findOne({ question });
    if (match) return res.json({ answer: match.answer });
    res.json({ answer: "No answer was found for the selected question" });
  } catch (err) {
    res.status(500).json({ error: "Error fetching answer" });
  }
};
