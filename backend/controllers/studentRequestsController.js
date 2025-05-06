const StudentRequest = require("../models/StudentRequest");
const User = require("../models/User");
const RequestType = require("../models/RequestType");
const Course = require("../models/Course");

const getRequestsForStaff = async (req, res) => {
  try {
    const staffUsername = req.query.staffUsername;

    const staffUser = await User.findOne({ username: staffUsername });

    if (!staffUser) {
      return res.status(404).json({ message: "Staff not found" });
    }

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

const approveRequest = async (req, res) => {
  try {
    const request = await StudentRequest.findByIdAndUpdate(
      req.params.id,
      { status: "אושר" },
      { new: true }
    );

    if (!request) {
      return res.status(404).send({ message: "Request not found" });
    }

    res.status(200).send(request);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getRequestsForStaff,
  approveRequest,
};
