const request = require("supertest");
const { app } = require("../index");
const User = require("../models/User");
const Course = require("../models/Course");
const RequestType = require("../models/RequestType");
const StudentRequest = require("../models/StudentRequest");

let student, staff, course, requestType;

beforeEach(async () => {
  await User.deleteMany({
    $or: [{ username: "testuserStudent" }, { username: "testuserStaff" }],
  });
  student = await User.create({
    id: "123456678",
    firstname: "TestStudent",
    lastname: "UserStudent",
    username: "testuserStudent",
    password: "testpass",
    role: "student",
    department: "Software Engineering",
    email: "test@email.com",
  });

  staff = await User.create({
    id: "112345677",
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

  await StudentRequest.create([
    {
      student: student._id,
      staff: staff._id,
      course: course._id,
      requestType: requestType._id,
      description: "בקשה 1",
      status: "ממתין",
    },
    {
      student: student._id,
      staff: staff._id,
      course: course._id,
      requestType: requestType._id,
      description: "בקשה 2",
      status: "אושר",
    },
  ]);
});

afterEach(async () => {
  await StudentRequest.deleteMany({ student: student._id });
  await User.deleteMany({
    username: { $in: ["testuserStudent", "testuserStaff"] },
  });
  await Course.deleteMany({ name: "מבוא לתקשורת מחשבים" });
  await RequestType.deleteMany({ name: "בקשה למועד מיוחד" });
});

describe("Filter requests", () => {
  test("return only requests with matching status and staff", async () => {
    const res = await request(app)
      .get("/api/staff/requests/by-status-and-staff")
      .query({ staffUsername: "testuserStaff", status: "ממתין" })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe("ממתין");
    expect(res.body[0].staff.username).toBeUndefined();
  });

  test("return requests only for the correct studentId", async () => {
    const res = await request(app)
      .get("/api/staff/requests/by-student-id")
      .query({ studentId: student.id })
      .expect(200);

    console.log(res.body);

    expect(res.body.length).toBe(2);
    expect(res.body[0].student.id).toBe(student.id);
  });
});
