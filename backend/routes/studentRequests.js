const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const StudentRequest = require("../models/StudentRequest");
const User = require("../models/User");
const Course = require("../models/Course");
const RequestType = require("../models/RequestType");

const {
  getRequestsForStaff,
  approveRequest,
  rejectRequest,
  getRequestsForStaffByStatus,
  getRequestsByStudentId,
  transferRequest,
} = require("../controllers/studentRequestsController");


const isStaff = (req, res, next) => {
  if (req.headers["user-role"] === "Staff") {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized - Not Staff" });
  }
};


const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.post("/", upload.array("documents"), async (req, res) => {
  try {
    const {
      student,
      staff,
      requestType,
      course,
      description,
      department,
      status,
      submissionDate,
    } = req.body;

    if (!student || !staff || !requestType || !course) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const studentData = await User.findById(student);
    const staffData = await User.findById(staff);
    const courseData = await Course.findById(course);
    const requestTypeData = await RequestType.findById(requestType);

    const documents = req.files.map((file) => ({
      documentName: file.originalname,
      documentURL: `/uploads/${file.filename}`,
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
      requestTypeName: requestTypeData.name,
    });

    await newRequest.save();
    res.status(201).json({ message: "הבקשה נשלחה בהצלחה!" });
  } catch (err) {
    console.error("שגיאה בשליחת הבקשה:", err);
    res.status(500).json({ message: "שגיאה בשליחת הבקשה", error: err.message });
  }
});


router.get("/", isStaff, getRequestsForStaff);

router.get("/department/:departmentName", async (req, res) => {
  try {
    const requests = await StudentRequest.find({
      department: req.params.departmentName,
    })
      .populate("student", "username")
      .populate("course", "name")
      .populate("requestType", "name");

    res.json(requests);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error loading requests for the department" });
  }
});

router.get("/department-requests", async (req, res) => {
  const department = req.query.department;
  if (!department) {
    return res.status(400).json({ message: "Missing department" });
  }

  try {
    const requests = await StudentRequest.find()
      .populate("student")
      .populate("staff")
      .populate("course")
      .populate("requestType");

    const filtered = requests.filter(
      (req) => req.student?.department === department
    );

    res.json(filtered);
  } catch (err) {
    console.error("Error fetching department requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/approve/:id", approveRequest);
router.put("/reject/:id", rejectRequest);
router.put("/transfer/:id", transferRequest);
router.get("/by-status-and-staff", getRequestsForStaffByStatus);
router.get("/by-student-id", getRequestsByStudentId);

module.exports = router;