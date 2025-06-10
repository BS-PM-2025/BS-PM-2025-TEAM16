const request = require("supertest");
const { app } = require("../index");
const User = require("../models/User");
const StudentRequest = require("../models/StudentRequest");
const Course = require("../models/Course");
const RequestType = require("../models/RequestType");

let student, staff, course, requestType;

beforeEach(async () => {
  await User.deleteMany({
    $or: [{ username: "testuserStudent" }, { username: "testuserStaff" }],
  });
  student = await User.create({
    id: "123456788",
    firstname: "TestStudent",
    lastname: "UserStudent",
    username: "testuserStudent",
    password: "testpass",
    role: "student",
    department: "Software Engineering",
    email: "test@email.com",
  });

  staff = await User.create({
    id: "112234567",
    firstname: "TestStaff",
    lastname: "UserStaff",
    username: "testuserStaff",
    password: "testpass",
    role: "staff",
    department: "Software Engineering",
    email: "test@email.com",
  });

  course = await Course.create({
    name: "מבוא לתקשורת מחשבים",
    department: "Software Engineering",
    lecturer: staff._id,
  });
  requestType = await RequestType.create({ name: "בקשה למועד מיוחד" });
});

afterEach(async () => {
  await StudentRequest.deleteMany({
    description: { $in: ["בדיקה לאישור", "בדיקה לדחייה"] },
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
      description: "בדיקה לאישור",
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
      description: "בדיקה לדחייה",
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
