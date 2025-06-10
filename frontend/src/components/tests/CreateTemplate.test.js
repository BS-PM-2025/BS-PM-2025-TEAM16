import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Staff from "../Staff";

jest.mock("axios");

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
  window.scrollTo = jest.fn();
});

describe("temp answer", () => {
  beforeEach(() => {
    localStorage.setItem(
      "projectFS",
      JSON.stringify({
        user: { username: "staff2", role: "Staff" },
      })
    );
    axios.get.mockResolvedValue({ data: [] });
  });

  test("save button", async () => {
    axios.post.mockResolvedValueOnce({});

    render(<Staff />);

    const toggleTitle = await screen.findByText("הוספת תבנית תשובה חדשה");
    fireEvent.click(toggleTitle);

    fireEvent.change(screen.getByLabelText("שם התבנית:"), {
      target: { value: "name test" },
    });

    fireEvent.change(screen.getByLabelText("תוכן התשובה:"), {
      target: { value: "text test" },
    });

    fireEvent.click(screen.getByRole("button", { name: /שמור תבנית/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3006/api/answer-templates",
        {
          name: "name test",
          text: "text test",
        }
      );
    });

    expect(await screen.findByText("התבנית נשמרה בהצלחה")).toBeInTheDocument();
  });

  test("fields empty", async () => {
    render(<Staff />);

    const toggleTitle = await screen.findByText("הוספת תבנית תשובה חדשה");
    fireEvent.click(toggleTitle);

    fireEvent.click(screen.getByRole("button", { name: /שמור תבנית/i }));

    await waitFor(() => {
      expect(
        screen.getByText("יש למלא את כל השדות הנדרשים")
      ).toBeInTheDocument();
    });

    expect(axios.post).not.toHaveBeenCalled();
  });
});
