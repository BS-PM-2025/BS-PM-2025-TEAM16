import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import StaffStudentSearchBox from "../StaffStudentSearchBox"; // ← הנתיב בהתאם למיקום שלך

jest.mock("axios");

describe("StaffStudentSearchBox", () => {
  test("מראה קלט וכפתור", () => {
    render(<StaffStudentSearchBox />);
    expect(screen.getByPlaceholderText("הכנס תעודת זהות של סטודנט")).toBeInTheDocument();
    expect(screen.getByText("חפש")).toBeInTheDocument();
  });

  test("שולח בקשה ומציג פרטי סטודנט בהצלחה", async () => {
    const mockStudent = {
      firstname: "רות",
      lastname: "כהן",
      role: "student",
      department: "הנדסה",
      email: "ruth@example.com",
      employeeId: "12345"
    };

    axios.get.mockResolvedValueOnce({ data: mockStudent });

    render(<StaffStudentSearchBox />);
    fireEvent.change(screen.getByPlaceholderText("הכנס תעודת זהות של סטודנט"), {
      target: { value: "987654321" },
    });
    fireEvent.click(screen.getByText("חפש"));

    await waitFor(() => {
      expect(screen.getByText("רות")).toBeInTheDocument();
      expect(screen.getByText("כהן")).toBeInTheDocument();
      expect(screen.getByText("student")).toBeInTheDocument();
      expect(screen.getByText("הנדסה")).toBeInTheDocument();
      expect(screen.getByText("ruth@example.com")).toBeInTheDocument();
      expect(screen.getByText("12345")).toBeInTheDocument();
    });
  });

  test("מציג הודעת שגיאה כשאין סטודנט", async () => {
    axios.get.mockRejectedValueOnce(new Error("Not found"));

    render(<StaffStudentSearchBox />);
    fireEvent.change(screen.getByPlaceholderText("הכנס תעודת זהות של סטודנט"), {
      target: { value: "000000000" },
    });
    fireEvent.click(screen.getByText("חפש"));

    await waitFor(() => {
      expect(screen.getByText("לא נמצא סטודנט עם התעודה הזו")).toBeInTheDocument();
    });
  });
});
