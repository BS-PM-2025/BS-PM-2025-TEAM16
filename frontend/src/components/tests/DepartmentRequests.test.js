import { render, screen, waitFor } from "@testing-library/react";
import DepartmentRequests from "../DepartmentRequests";
import axios from "axios";
import * as storage from "../../utils/services";

jest.mock("axios");

const mockUser = {
  user: {
    department: "הנדסת תוכנה",
  },
};

const mockRequests = [
  {
    _id: "1",
    status: "מאושר",
    submissionDate: "2025-05-24T12:00:00Z",
    student: {
      firstname: "נועה",
      lastname: "כהן",
      id: "123456789",
    },
    requestType: {
      name: "דחיית הגשת עבודה",
    },
    course: {
      name: "מבוא לקומפילציה",
    },
  },
];

beforeEach(() => {
  jest.spyOn(storage, "getFromLocalStorage").mockReturnValue(mockUser);
});

test("מציג טבלת בקשות למחלקה", async () => {
  axios.get.mockResolvedValueOnce({ data: mockRequests });

  render(<DepartmentRequests />);

  expect(screen.getByText("טוען נתונים...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("בקשות לפי המחלקה שלי:")).toBeInTheDocument();
    expect(screen.getByText("נועה כהן")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
    expect(screen.getByText("דחיית הגשת עבודה")).toBeInTheDocument();
    expect(screen.getByText("מבוא לקומפילציה")).toBeInTheDocument();
    expect(screen.getByText("מאושר")).toBeInTheDocument();
  });
});

test("מציג הודעה אם אין בקשות", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<DepartmentRequests />);

  await waitFor(() => {
    expect(screen.getByText("לא קיימות בקשות במחלקה שלך")).toBeInTheDocument();
  });
});

test("מציג הודעה אם אין משתמש במחלקה", async () => {
  jest.spyOn(storage, "getFromLocalStorage").mockReturnValue(null);

  render(<DepartmentRequests />);

  await waitFor(() => {
    expect(screen.getByText("לא קיימות בקשות במחלקה שלך")).toBeInTheDocument();
  });
});
