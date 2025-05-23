import { render, screen, within } from "@testing-library/react";
import StudentRequestsTable from "../StudentRequestsTable";
import axios from "axios";

jest.mock("axios");

test("student requests table", async () => {
  window.alert = jest.fn();

  localStorage.setItem(
    "projectFS",
    JSON.stringify({ user: { username: "StudentTest" } })
  );

  const mockRequests = {
    _id: "4",
    student: {
      firstname: "StudentTest",
      lastname: "lstudent",
      id: "888888888",
    },
    staff: { firstname: "StaffTest", lastname: "lstaff", id: "99999999" },
    course: { name: "מבוא לקומפילציה" },
    requestType: { name: "דחיית הגשת עבודה" },
    description: "Test",
    documents: [],
    department: "Software Engineering",
    status: "ממתין",
    submissionDate: "2025-04-14T12:00:00.000+00:00",
    staffComments: [],
  };

  axios.get.mockResolvedValue(Promise.resolve({ data: [mockRequests] }));

  render(<StudentRequestsTable />);

  const table = await screen.findByRole("table");

  expect(table).toBeInTheDocument();

  const statusCell = within(table).getByText("ממתין");
  expect(statusCell).toBeInTheDocument();

  expect(within(table).getByText("מבוא לקומפילציה")).toBeInTheDocument();
  expect(within(table).getByText("דחיית הגשת עבודה")).toBeInTheDocument();
});
