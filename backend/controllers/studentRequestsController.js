const StudentRequest = require("../models/StudentRequest");
const User = require("../models/User");
const RequestType = require("../models/RequestType");
const Course = require("../models/Course");
const nodemailer = require("nodemailer");

const getRequestsForStaff = async (req, res) => {
  try {
    const staffUsername = req.query.staffUsername;
    const staffUser = await User.findOne({ username: staffUsername });

    if (!staffUser) return res.status(404).json({ message: "Staff not found" });

    let requests = [];

    if (staffUser.position === "lecturer") {
      // בקשות מהקורסים של המרצה
      const courses = await Course.find({ lecturer: { $in: [staffUser._id] } });
      const courseIds = courses.map((course) => course._id);
      requests = await StudentRequest.find({ course: { $in: courseIds } });
    } else if (staffUser.position === "secretary") {
      // בקשות שהועברו אל המזכירה או מהמחלקה שלה
      requests = await StudentRequest.find({
        $or: [
          { course: { $exists: true }, department: staffUser.department },
          { staff: staffUser._id }
        ]
      });
    } else {
      // כל איש סגל אחר – רק בקשות שהוקצו אליו ישירות
      requests = await StudentRequest.find({ staff: staffUser._id });
    }

    const populated = await StudentRequest.populate(requests, [
      { path: "student", select: "firstname lastname id department" },
      { path: "staff", select: "firstname lastname" },
      { path: "requestType", select: "name" },
      { path: "course", select: "name department" },
    ]);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getRequestsForStudent = async (req, res) => {
  try {
    const studentUsername = req.query.studentUsername;
    const studentUser = await User.findOne({ username: studentUsername });

    if (!studentUser) return res.status(404).json({ message: "Student not found" });

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
    const request = await StudentRequest.findById(req.params.id)
      .populate("student", "firstname lastname email")
      .populate("course", "name")
      .populate("requestType", "name");

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dorin2107@gmail.com",
        pass: "syhyigdbowmrtesa",
      },
    });

    const mailOptions = {
      from: "dorin2107@gmail.com",
      to: request.student.email,
      subject: "הבקשה שלך אושרה",
      text: `שלום ${request.student.firstname},\n\nהבקשה שלך בנושא "${request.requestType.name}" בקורס "${request.course.name}" אושרה.\n${req.body.comment ? `הערת איש הסגל: ${req.body.comment}` : ""}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const request = await StudentRequest.findById(req.params.id)
      .populate("student", "firstname lastname email")
      .populate("course", "name")
      .populate("requestType", "name");

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dorin2107@gmail.com",
        pass: "syhyigdbowmrtesa",
      },
    });

    const mailOptions = {
      from: "dorin2107@gmail.com",
      to: request.student.email,
      subject: "הבקשה שלך נדחתה",
      text: `שלום ${request.student.firstname},\n\nהבקשה שלך בנושא "${request.requestType.name}" בקורס "${request.course.name}" נדחתה.\n${req.body.comment ? `הערת איש הסגל: ${req.body.comment}` : ""}`,
    };

    await transporter.sendMail(mailOptions);
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
  try {
    const studentId = req.query.studentId;
    if (!studentId)
      return res.status(400).json({ message: "Missing student ID" });

    const requests = await StudentRequest.find()
      .populate("student")
      .populate("staff")
      .populate("course")
      .populate("requestType");

    const filtered = requests.filter((req) => req.student?.id === studentId);
    res.json(filtered);
  } catch (error) {
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
    res.status(500).json({ message: "Error transferring request", error: err.message });
  }
};

const getStaleRequests = async (req, res) => {
  try {
    const { staffUsername } = req.query;
    const staffUser = await User.findOne({ username: staffUsername });

    if (!staffUser) return res.status(404).json({ message: "Staff not found" });

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const staleRequests = await StudentRequest.find({
      staff: staffUser._id,
      status: "ממתין",
      submissionDate: { $lte: threeDaysAgo },
    }).populate("student requestType course");

    res.json(staleRequests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const sendMessageToStudent = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { senderId, message } = req.body;

    const request = await StudentRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.messages = request.messages || [];

    request.messages.push({
      sender: senderId,
      message: message,
      date: new Date(),
    });

    await request.save();

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getMessagesForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const requests = await StudentRequest.find({ student: studentId })
      .select("messages") // רק ההודעות
      .populate("messages.sender", "firstname lastname"); // שם השולח

    // איסוף כל ההודעות מכל הבקשות
    const allMessages = requests.flatMap((r) =>
      r.messages.map((m) => ({
        requestId: r._id,
        sender: m.sender,
        message: m.message,
        date: m.date,
      }))
    );

    res.json(allMessages);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בקבלת ההודעות", error: err.message });
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
  getStaleRequests,
  sendMessageToStudent,
  getMessagesForStudent, 
};
