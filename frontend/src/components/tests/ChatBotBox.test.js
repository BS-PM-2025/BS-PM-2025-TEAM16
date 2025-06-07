import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatBotBox from "../ChatBotBox";

beforeEach(() => {
  window.fetch = jest.fn((url) => {
    if (url.includes("/questions")) {
      return Promise.resolve({
        json: () => Promise.resolve([{ question: "question test" }]),
      });
    }
    return Promise.resolve({
      json: () => Promise.resolve({ answer: "answer test" }),
    });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test("correct answer for question", async () => {
  render(<ChatBotBox />);

  const openButton = screen.getByRole("button", { name: /chatbot/i });
  fireEvent.click(openButton);

  const questionButton = await screen.findByText("question test");
  fireEvent.click(questionButton);

  const answer = await screen.findByText("answer test");
  expect(answer).toBeInTheDocument();
});
