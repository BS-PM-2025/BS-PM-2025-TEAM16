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

test("filters requests by status", async () => {
  window.alert = jest.fn();

  localStorage.setItem(
    "projectFS",
    JSON.stringify({ user: { username: "staff1" } })
  );

  axios.get.mockImplementation((url) => {
    if (url.includes("status=אושר")) {
      return Promise.resolve({
        data: [
          {
            _id: "2",
            student: {
              firstname: "StudentTest",
              lastname: "User",
              id: "333333333",
            },
            staff: {
              firstname: "StaffTest",
              lastname: "User",
              id: "444444444",
            },
            course: { name: "מבוא לקומפילציה" },
            requestType: { name: "דחיית הגשת עבודה" },
            description: "Test",
            documents: [],
            department: "Software Engineering",
            status: "אושר",
            submissionDate: "2025-04-14T12:00:00.000+00:00",
            staffComments: [],
          },
        ],
      });
    }
    return Promise.resolve({ data: [] });
  });

  render(<Staff />);

  await waitFor(() => expect(axios.get).toHaveBeenCalled());

  fireEvent.change(screen.getByLabelText("סינון לפי סטטוס:"), {
    target: { value: "אושר" },
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("status=אושר"),
      expect.any(Object)
    );
  });

  const table = screen.getByRole("table");
  const statusCell = within(table).getByText("אושר");
  expect(statusCell).toBeInTheDocument();
});
