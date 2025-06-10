const express = require("express");
const router = express.Router();
const { getQuestions, getAnswer } = require("../controllers/chatbotController");

router.get("/chatbot/questions", getQuestions);
router.post("/chatbot/answer", getAnswer);

module.exports = router;
