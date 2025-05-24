const express = require('express');
const router = express.Router();
const User = require('../models/User');

// הוספת משתמש
router.post('/add-user', async (req, res) => {
  const { username, firstname, lastname, password, role, department } = req.body;

  try {
    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'שם משתמש כבר קיים במערכת' });
    }

    const newUser = new User({ username, firstname, lastname, password, role, department });
    await newUser.save();
    res.status(201).json({ message: 'משתמש נוסף בהצלחה' });

  } catch (err) {
    console.error("שגיאה בהוספת משתמש:", err.message);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
});


// עריכת תפקיד לפי ת"ז (id)
router.put('/update-role/:id', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      { role: req.body.role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    res.json({ message: 'התפקיד עודכן בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאה בעדכון התפקיד' });
  }
});

// צפייה בכל המשתמשים
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפה' });
  }
});

// שליפת פרטי משתמש לפי שם משתמש
router.get('/by-username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
