const request = require("supertest");
const { app } = require("../index");
const User = require("../models/User");

let testUser;

beforeEach(async () => {
  testUser = await User.create({
    id: "515151511",
    firstname: "Reset",
    lastname: "User",
    username: "testuserReset",
    password: "oldpass",
    role: "student",
    department: "Software Engineering",
    email: "reset@test.com",
  });
});

afterEach(async () => {
  await User.deleteMany({ username: "testuserReset" });
});

describe("Password reset integration", () => {
  test("should return 400 if data is missing", async () => {
    const res = await request(app)
      .post("/api/reset-password")
      .send({})
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Missing/);
  });

  test("should return 404 if user not found", async () => {
    const res = await request(app)
      .post("/api/reset-password")
      .send({ username: "nonexistent", newPassword: "somepass" })
      .expect(404);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/);
  });

  test("should reset password successfully", async () => {
    const res = await request(app)
      .post("/api/reset-password")
      .send({
        username: "testuserReset",
        newPassword: "newSecret123"
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/successfully/);

    const updatedUser = await User.findOne({ username: "testuserReset" });
    expect(updatedUser.password).toBe("newSecret123");
  });
});
