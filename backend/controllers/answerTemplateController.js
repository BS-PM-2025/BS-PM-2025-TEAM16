const AnswerTemplate = require("../models/AnswerTemplate");

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await AnswerTemplate.find({});
    res.json(templates);
  } catch (error) {
    console.error("Error fetching answer templates", error);
    res.status(500).json({ message: "Failed to fetch answer templates" });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const { name, text } = req.body;
    const newTemplate = new AnswerTemplate({ name, text });
    await newTemplate.save();
    res
      .status(201)
      .json({ message: "Template created successfully", newTemplate });
  } catch (error) {
    console.error("Error creating template", error);
    res.status(500).json({ message: "Failed to create template" });
  }
};
