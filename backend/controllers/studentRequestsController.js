const StudentRequest = require("../models/StudentRequest");
const User = require("../models/User");
const RequestType = require("../models/RequestType");
const Course = require("../models/Course");

const getRequestsForStaff = async (req, res) => {
  try {
    const staffUsername = req.query.staffUsername;

    const staffUser = await User.findOne({ username: staffUsername });

    if (!staffUser) return res.status(404).json({ message: "Staff not found" });

    const requests = await StudentRequest.find({ staff: staffUser._id })
      .populate("student", "firstname lastname id department")
      .populate("staff", "firstname lastname")
      .populate("requestType", "name")
      .populate("course", "name");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRequestsForStudent = async (req, res) => {
  try {
    const studentUsername = req.query.studentUsername;
    const studentUser = await User.findOne({ username: studentUsername });

    if (!studentUser)
      return res.status(404).json({ message: "Student not found" });

    const requests = await StudentRequest.find({ student: studentUser._id })
      .populate("requestType", "name")
      .populate("course", "name");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    console.log("comment received:", req.body.comment);
    const request = await StudentRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "אושר";

    if (req.body.comment) {
      request.staffComments.push({
        comment: req.body.comment,
        staff: req.body.staffId,
        date: new Date(),
      });
    }

    await request.save();
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    console.log("comment received:", req.body.comment);
    const request = await StudentRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "נדחה";

    if (req.body.comment) {
      request.staffComments.push({
        comment: req.body.comment,
        staff: req.body.staffId,
        date: new Date(),
      });
    }

    await request.save();
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRequestsForStaffByStatus = async (req, res) => {
  try {
    const { staffUsername, status } = req.query;
    const staffUser = await User.findOne({ username: staffUsername });

    if (!staffUser) return res.status(404).json({ message: "Staff not found" });

    const requests = await StudentRequest.find({
      staff: staffUser._id,
      status: status,
    })
      .populate("student", "firstname lastname id department")
      .populate("staff", "firstname lastname")
      .populate("requestType", "name")
      .populate("course", "name");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRequestsByStudentId = async (req, res) => {
  const studentId = req.query.studentId;
  if (!studentId)
    return res.status(400).json({ message: "Missing student ID" });

  try {
    const requests = await StudentRequest.find()
      .populate("student")
      .populate("staff")
      .populate("course")
      .populate("requestType");

    const filtered = requests.filter((req) => req.student?.id === studentId);
    res.json(filtered);
  } catch (error) {
    console.error("Error fetching requests by student ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const transferRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { newStaffId } = req.body;

    const request = await StudentRequest.findByIdAndUpdate(
      requestId,
      { staff: newStaffId },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ message: "Request transferred successfully", request });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error transferring request", error: err.message });
  }
};

module.exports = {
  getRequestsForStaff,
  approveRequest,
  rejectRequest,
  getRequestsForStaffByStatus,
  transferRequest,
  getRequestsByStudentId,
  getRequestsForStudent,
};
