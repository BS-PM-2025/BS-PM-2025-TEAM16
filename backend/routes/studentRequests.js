//most recent
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const StudentRequest = require('../models/StudentRequest');
const User = require('../models/User');
const Course = require('../models/Course');
const RequestType = require('../models/RequestType');


const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.array('documents'), async (req, res) => {
  try {
    const {
      student,
      staff,
      requestType,
      course,
      description,
      department,
      status,
      submissionDate
    } = req.body;

    if (!student || !staff || !requestType || !course) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    
    const studentData = await User.findById(student);
    const staffData = await User.findById(staff);
    const courseData = await Course.findById(course);
    const requestTypeData = await RequestType.findById(requestType);

    const documents = req.files.map(file => ({
      documentName: file.originalname,
      documentURL: `/uploads/${file.filename}`
    }));

    const newRequest = new StudentRequest({
      student,
      staff,
      requestType,
      course,
      description,
      department,
      status,
      submissionDate,
      documents,
      staffComments: [],
      studentName: `${studentData.firstname} ${studentData.lastname}`,
      studentUsername: studentData.username,
      courseName: courseData.name,
      requestTypeName: requestTypeData.name
    });

    await newRequest.save();
    res.status(201).json({ message: 'הבקשה נשלחה בהצלחה!' });
  } catch (err) {
    console.error('שגיאה בשליחת הבקשה:', err);
    res.status(500).json({ message: 'שגיאה בשליחת הבקשה', error: err.message });
  }
});

module.exports = router;
