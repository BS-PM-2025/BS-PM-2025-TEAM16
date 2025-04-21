const StudentRequest = require('../models/StudentRequest');
const User = require('../models/User');
const RequestType = require('../models/RequestType');
const Course = require('../models/Course');


const getRequestsForStaff = async (req, res) => {
  try {
    const staffUsername = req.query.staffUsername;

    const staffUser = await User.findOne({ username: staffUsername });

    if (!staffUser) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const requests = await StudentRequest.find({ staff: staffUser._id })
      .populate('student', 'firstname lastname id department')
      .populate('staff', 'firstname lastname')
      .populate('requestType', 'name')
      .populate('course', 'name');



    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRequestsForStaff
};
