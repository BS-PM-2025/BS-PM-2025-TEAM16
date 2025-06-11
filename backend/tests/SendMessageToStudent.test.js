const request = require("supertest");
const { app, startServer, stopServer } = require("../index");

describe("POST /api/requests/messages", () => {
  let server;

  beforeAll(async () => {
    process.env.PORT = 3990;
    server = await startServer();
  }, 15000);

  afterAll(async () => {
    await stopServer();
  });

  test("מחזיר קוד תקין (200 או 404)", async () => {
    const messageData = {
      student: "60d21b4667d0d8992e610c85", 
      staff: "60d21b4967d0d8992e610c86",  
      content: "בדיקת הודעה מ-Jest",
    };

    const res = await request(app)
      .post("/api/requests/messages")
      .send(messageData);

    console.log("Response:", res.statusCode, res.body);

    expect([200, 404]).toContain(res.statusCode);
  });
});
