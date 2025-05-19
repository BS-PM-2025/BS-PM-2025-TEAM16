import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import Staff from "../Staff";
import axios from "axios";

jest.mock("axios");

test("filters requests by student ID", async () => {
  window.alert = jest.fn();

  localStorage.setItem(
    "projectFS",
    JSON.stringify({ user: { username: "staff1" } })
  );

  const requestById = {
    _id: "3",
    student: { firstname: "StudentTest", lastname: "User", id: "555555555" },
    staff: { firstname: "StaffTest", lastname: "User", id: "666666666" },
    course: { name: "מבוא לקומפילציה" },
    requestType: { name: "דחיית הגשת עבודה" },
    description: "Test",
    documents: [],
    department: "Software Engineering",
    status: "ממתין",
    submissionDate: "2025-04-14T12:00:00.000+00:00",
    staffComments: [],
  };

  axios.get.mockResolvedValueOnce({ data: [] });
  render(<Staff />);
  await waitFor(() => expect(axios.get).toHaveBeenCalled());

  axios.get.mockResolvedValueOnce({ data: [requestById] });

  fireEvent.change(screen.getByPlaceholderText("הקלד תעודת זהות"), {
    target: { value: "555555555" },
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("studentId=555555555"),
      expect.any(Object)
    );
  });

  const table = screen.getByRole("table");
  const idCell = within(table).getByText("555555555");
  expect(idCell).toBeInTheDocument();
});
