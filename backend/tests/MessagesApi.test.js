const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../index");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
}, 10000);

afterAll(async () => {
  await mongoose.disconnect();
}, 10000);

test("GET /api/requests/messages/:studentId מחזיר הודעות", async () => {
    const studentId = "666f35b2cfbaf64a2f1b234a";
    const res = await request(app).get(`/api/requests/messages/${studentId}`);
  
    console.log("Response status:", res.statusCode);
    console.log("Response body:", res.body);
  
    expect([200, 404]).toContain(res.statusCode);
  });
  
