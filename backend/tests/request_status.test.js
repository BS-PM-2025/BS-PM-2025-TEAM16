const request = require("supertest");
const { app } = require("../index");
const User = require("../models/User");
const StudentRequest = require("../models/StudentRequest");
const Course = require("../models/Course");
const RequestType = require("../models/RequestType");

let student, staff, course, requestType;

beforeEach(async () => {
  student = await User.create({
    id: "123456788",
    firstname: "TestStudent",
    lastname: "UserStudent",
    username: "testuserStudent",
    password: "testpass",
    role: "student",
    department: "Software Engineering",
  });

  staff = await User.create({
    id: "112234567",
    firstname: "TestStaff",
    lastname: "UserStaff",
    username: "testuserStaff",
    password: "testpass",
    role: "Staff",
    department: "Software Engineering",
  });

  course = await Course.create({ name: "מבוא לתקשורת מחשבים" });
  requestType = await RequestType.create({ name: "בקשה למועד מיוחד" });
});

afterEach(async () => {
  await StudentRequest.deleteMany({
    topic: { $in: ["בדיקה לאישור", "בדיקה לדחייה"] },
    student: student._id,
  });

  await User.deleteMany({
    username: { $in: ["testuserStudent", "testuserStaff"] },
  });
  await Course.deleteMany({ name: "מבוא לתקשורת מחשבים" });
  await RequestType.deleteMany({ name: "בקשה למועד מיוחד" });
});

describe("Student request status updates", () => {
  test("approve a student request", async () => {
    const req = await StudentRequest.create({
      student: student._id,
      staff: staff._id,
      course: course._id,
      requestType: requestType._id,
      topic: "בדיקה לאישור",
      status: "ממתין",
    });

    const res = await request(app)
      .put(`/api/staff/requests/approve/${req._id}`)
      .set("user-role", "Staff")
      .expect(200);

    const updated = await StudentRequest.findById(req._id);
    expect(updated.status).toBe("אושר");
  });

  test("reject a student request", async () => {
    const req = await StudentRequest.create({
      student: student._id,
      staff: staff._id,
      course: course._id,
      requestType: requestType._id,
      topic: "בדיקה לדחייה",
      status: "ממתין",
    });

    const res = await request(app)
      .put(`/api/staff/requests/reject/${req._id}`)
      .set("user-role", "Staff")
      .expect(200);

    const updated = await StudentRequest.findById(req._id);
    expect(updated.status).toBe("נדחה");
  });
});
