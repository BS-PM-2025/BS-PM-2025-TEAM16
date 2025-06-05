const express = require("express");
const router = express.Router();
const {
  getAllTemplates,
  createTemplate,
} = require("../controllers/answerTemplateController");

router.get("/", getAllTemplates);
router.post("/", createTemplate);
module.exports = router;
