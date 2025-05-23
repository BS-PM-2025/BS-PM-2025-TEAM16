const request = require("supertest");
const { app } = require("../index");
const User = require("../models/User");
const StudentRequest = require("../models/StudentRequest");
const RequestType = require("../models/RequestType");
const Course = require("../models/Course");

let student, staff, course, requestType, studentRequest;
const COURSE_NAME = "(בדיקות) מערכות הפעלה";
const REQUEST_NAME = "(בדיקות) בקשה לפטור מדרישת קדם";

beforeEach(async () => {
  await User.deleteMany({
    $or: [{ username: "testuserStudent" }, { username: "testuserStaff" }],
  });
  await Course.deleteMany({ name: COURSE_NAME });
  await RequestType.deleteMany({ name: REQUEST_NAME });

  student = await User.create({
    id: "123445678",
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
    role: "Staff",
    department: "Software Engineering",
    email: "test@email.com",
  });

  course = await Course.create({ name: COURSE_NAME });
  requestType = await RequestType.create({ name: REQUEST_NAME });

  studentRequest = await StudentRequest.create({
    student: student._id,
    staff: staff._id,
    requestType: requestType._id,
    course: course._id,
    description: "מבקשת פטור מדרישת קדם",
    department: student.department,
    status: "ממתין",
    submissionDate: new Date(),
    staffComments: [
      {
        comment: "נא לעדכן מסמכים",
        staff: staff._id,
        date: new Date(),
      },
    ],
  });
});

afterEach(async () => {
  await StudentRequest.deleteOne({ _id: studentRequest._id });
});

describe("returns list of requests", () => {
  test("returns list of requests for TestStudent", async () => {
    const response = await request(app)
      .get("/api/student/requests?studentUsername=testuserStudent")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toMatchObject({
      description: "מבקשת פטור מדרישת קדם",
      status: "ממתין",
    });

    console.log("Requests for testuserStudent:", response.body);
  });
});
