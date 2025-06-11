import React from "react";
import { render, screen } from "@testing-library/react";
import MessagesPage from "../MessagesPage";

jest.mock("../../utils/services", () => ({
  getFromLocalStorage: () => ({ user: { _id: "123" } }),
}));

jest.mock("axios", () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: [
        { message: "בדיקה 1", date: new Date().toISOString(), senderName: "מרצה א'" },
      ],
    })
  ),
}));

test("מציג כותרת הודעות", async () => {
  render(<MessagesPage />);
  expect(await screen.findByText("הודעות מאנשי סגל")).toBeInTheDocument();
});
