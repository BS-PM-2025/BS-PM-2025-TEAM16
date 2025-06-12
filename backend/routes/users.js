const express = require('express');
const router = express.Router();
const User = require('../models/User');

// הוספת משתמש
router.post('/add-user', async (req, res) => {
  console.log("קלט שהתקבל:", req.body); // רושם את כל הקלט
  const { id, username, firstname, lastname, password, role, department, position, email, employeeId, startYear } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("שם משתמש קיים");
      return res.status(400).json({ message: 'שם משתמש כבר קיים במערכת' });
    }

    // בדיקת startYear חוקית
    if (startYear && (startYear < 1900 || startYear > 2100)) {
      console.log("שנת התחלה לא חוקית");
      return res.status(400).json({ message: 'שנת התחלה לא חוקית' });
    }

    const newUser = new User({
      id,
      username,
      firstname,
      lastname,
      password,
      role,
      department,
      position: role !== "student" ? position : undefined,
      email,
      employeeId: role !== "student" ? employeeId : undefined,
      startYear: role !== "student" ? startYear : undefined,
    });

    await newUser.save();
    console.log("נשמר בהצלחה");
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

router.get("/staff-by-department", async (req, res) => {
  try {
    const department = req.query.department;
    if (!department) {
      return res.status(400).json({ message: "Missing department" });
    }

    const staffInDepartment = await User.find({
      role: "staff",
      department: department,
    }).select("firstname lastname _id");

    res.json(staffInDepartment);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בקבלת אנשי הסגל", error: err.message });
  }
});
// מחיקת משתמש לפי תעודת זהות
router.delete("/by-id/:id", async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }
    res.status(200).json({ message: "נמחק בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: "שגיאה במחיקת המשתמש" });
  }
});
router.get("/by-id/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
