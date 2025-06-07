const request = require("supertest");
const { app } = require("../index");
const ChatBot = require("../models/ChatBot");

beforeEach(async () => {
  await ChatBot.deleteMany({ question: /test/ });
  await ChatBot.create({
    question: "question test",
    answer: "answer test",
  });
});

afterEach(async () => {
  await ChatBot.deleteMany({ question: /test/ });
});

describe("ChatBot", () => {
  test("chatbot questions", async () => {
    const res = await request(app).get("/api/chatbot/questions").expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find((q) => q.question === "question test")).toBeTruthy();
  });

  test("correct answer for question", async () => {
    const res = await request(app)
      .post("/api/chatbot/answer")
      .send({ question: "question test" })
      .expect(200);

    expect(res.body.answer).toBe("answer test");
  });

  test("question not found", async () => {
    const res = await request(app)
      .post("/api/chatbot/answer")
      .send({ question: "question not found" })
      .expect(200);

    expect(res.body.answer).toBe(
      "No answer was found for the selected question"
    );
  });
});
