import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Staff from "../Staff";
import axios from "axios";

jest.mock("axios");

const mockRequest = {
  _id: "1",
  student: { firstname: "StudentTest", lastname: "User", id: "111111111" },
  staff: { firstname: "StaffTest", lastname: "User", id: "222222222" },
  course: { name: "מבוא לקומפילציה" },
  requestType: { name: "דחיית הגשת עבודה" },
  description: "Test",
  documents: [],
  department: "Software Engineering",
  status: "ממתין",
  submissionDate: "2025-04-14T12:00:00.000+00:00",
  staffComments: [],
};

test("approve Request", async () => {
  window.alert = jest.fn();

  localStorage.setItem(
    "projectFS",
    JSON.stringify({ user: { username: "staff1" } })
  );

  axios.get.mockResolvedValueOnce({ data: [mockRequest] });
  axios.put.mockResolvedValueOnce({});
  render(<Staff />);
  await waitFor(() => expect(axios.get).toHaveBeenCalled());

  const row = await screen.findByText("מבוא לקומפילציה");
  fireEvent.click(row);

  const approveButton = await screen.findByText("אישור");
  fireEvent.click(approveButton);

  await waitFor(() => {
    expect(axios.put).toHaveBeenCalledWith(
      `http://localhost:3006/api/staff/requests/approve/${mockRequest._id}`
    );
  });
});

test("reject Request", async () => {
  window.alert = jest.fn();
  localStorage.setItem(
    "projectFS",
    JSON.stringify({ user: { username: "staff1" } })
  );

  axios.get.mockResolvedValueOnce({ data: [mockRequest] });
  axios.put.mockResolvedValueOnce({});
  render(<Staff />);
  await waitFor(() => expect(axios.get).toHaveBeenCalled());

  const row = await screen.findByText("מבוא לקומפילציה");
  fireEvent.click(row);

  const rejectButton = await screen.findByText("דחה");
  fireEvent.click(rejectButton);

  await waitFor(() => {
    expect(axios.put).toHaveBeenCalledWith(
      `http://localhost:3006/api/staff/requests/reject/${mockRequest._id}`
    );
  });
});
