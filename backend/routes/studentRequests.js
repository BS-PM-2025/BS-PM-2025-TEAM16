const express = require("express");
const router = express.Router();
const {
  getRequestsForStaff,
} = require("../controllers/studentRequestsController");

const isStaff = (req, res, next) => {
  if (req.headers["user-role"] === "Staff") {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized - Not Staff" });
  }
};

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
    const StudentRequest = require("../models/StudentRequest");

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

module.exports = router;
