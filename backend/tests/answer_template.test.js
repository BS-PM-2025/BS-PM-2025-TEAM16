const request = require("supertest");
const { app } = require("../index");
const AnswerTemplate = require("../models/AnswerTemplate");

describe("POST /api/answer-templates", () => {
  beforeEach(async () => {
    await AnswerTemplate.deleteMany({ name: "test template answer" });
  });

  afterEach(async () => {
    await AnswerTemplate.deleteMany({ name: "test template answer" });
  });

  test("template answer", async () => {
    const newTemplate = {
      name: "test template answer",
      text: "test answer",
    };

    const res = await request(app)
      .post("/api/answer-templates")
      .send(newTemplate)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(res.body).toHaveProperty("newTemplate._id");
    expect(res.body.newTemplate.name).toBe(newTemplate.name);
    expect(res.body.newTemplate.text).toBe(newTemplate.text);

    console.log("Template saved:", res.body);
  });
});
