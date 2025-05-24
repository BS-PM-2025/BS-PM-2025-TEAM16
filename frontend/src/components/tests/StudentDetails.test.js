import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentDetails from "../StudentDetails";
import axios from "axios";

jest.mock("axios");

test("מציג פרטי סטודנט שנמצאו", async () => {
  axios.get.mockResolvedValue({
    data: { firstname: "דנה", lastname: "כהן", role: "Student", department: "תוכנה" }
  });

  render(<StudentDetails />);
  fireEvent.change(screen.getByPlaceholderText("שם משתמש של הסטודנט"), { target: { value: "dana123" } });
  fireEvent.click(screen.getByText("חפש"));

  expect(await screen.findByText("שם פרטי:")).toBeInTheDocument();
  expect(screen.getByText("דנה")).toBeInTheDocument();
});

test("מציג הודעת שגיאה אם הסטודנט לא נמצא", async () => {
  axios.get.mockRejectedValue(new Error("Not found"));

  render(<StudentDetails />);
  fireEvent.change(screen.getByPlaceholderText("שם משתמש של הסטודנט"), { target: { value: "unknown" } });
  fireEvent.click(screen.getByText("חפש"));

  expect(await screen.findByText("לא נמצאו פרטים עבור שם המשתמש הזה.")).toBeInTheDocument();
});
