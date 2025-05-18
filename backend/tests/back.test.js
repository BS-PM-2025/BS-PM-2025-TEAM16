const request = require("supertest");
const { app } = require("../index");
const User = require("../models/User");

beforeEach(async () => {
  await User.create({
    id: "123123123",
    firstname: "Test",
    lastname: "User",
    username: "testuser",
    password: "testpass",
    role: "Admin",
    department: "Testdepart",
  });
});

afterEach(async () => {
  await User.deleteMany({ username: "testuser" });
});

describe("integration Test", () => {
  test("Successful login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "testpass" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.user).toMatchObject({
      firstname: "Test",
      lastname: "User",
      username: "testuser",
      role: "Admin",
      department: "Testdepart",
    });
  });

  test("Failed login with incorrect credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "worngpass" })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("returns list of student requests for user 'staff1'", async () => {
    const response = await request(app)
      .get("/api/staff/requests?staffUsername=staff1")
      .set("user-role", "Staff")
      .expect("Content-Type", /json/);

    console.log("Requests for staff1:", response.body);
  });

  test("returns list of student requests for user 'staff2'", async () => {
    const response = await request(app)
      .get("/api/staff/requests?staffUsername=staff2")
      .set("user-role", "Staff")
      .expect("Content-Type", /json/);

    console.log("Requests for staff2:", response.body);
  });
});
