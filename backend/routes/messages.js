const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// יצירת הודעת מערכת חדשה
router.post('/add', async (req, res) => {
  const { title, summary } = req.body;

  if (!title || !summary) {
    return res.status(400).json({ error: "חובה למלא כותרת ותוכן" });
  }

  try {
    const newMsg = new Message({ title, summary });
    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשמירת ההודעה" });
  }
});

// שליפת ההודעה האחרונה
router.get('/latest', async (req, res) => {
  try {
    const msg = await Message.findOne().sort({ createdAt: -1 });
    res.json(msg || {});
  } catch (err) {
    res.status(500).json({ error: "שגיאה בטעינה" });
  }
});

// שליפת כל ההודעות
router.get("/all", async (req, res) => {
  try {
    const all = await Message.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).send("שגיאה בטעינת ההודעות");
  }
});

module.exports = router;
