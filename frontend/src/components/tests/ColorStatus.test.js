import React from "react";
import { render, screen } from "@testing-library/react";
import StudentStatus from "../StudentStatus";


window.scrollTo = jest.fn();

const mockRequests = [
  {
    _id: "1",
    status: "אושר",
    submissionDate: "2025-05-23T09:51:46.240+00:00",
    requestType: { name: "דחיית הגשת עבודה" },
  },
  {
    _id: "2",
    status: "ממתין",
    submissionDate: "2025-05-23T09:51:46.240+00:00",
    requestType: { name: "אחר" },
  },
  {
    _id: "3",
    status: "נדחה",
    submissionDate: "2025-05-23T09:51:46.240+00:00",
    requestType: { name: "שחרור חסימת קורס" },
  },
];

test("last request per status", () => {
  render(<StudentStatus requests={mockRequests} />);

  expect(screen.getByText("דחיית הגשת עבודה")).toBeInTheDocument();
  expect(screen.getByText("אחר")).toBeInTheDocument();
  expect(screen.getByText("שחרור חסימת קורס")).toBeInTheDocument();

  // נשתמש ב־getAllByText כי יש כפילויות (גם בלחצן וגם בתצוגה)
  expect(screen.getAllByText("אושר").length).toBeGreaterThan(0);
  expect(screen.getAllByText("ממתין").length).toBeGreaterThan(0);
  expect(screen.getAllByText("נדחה").length).toBeGreaterThan(0);
});

test("status - correct color class", () => {
  render(<StudentStatus requests={mockRequests} />);

  const statusCards = screen.getAllByText(/אושר|ממתין|נדחה/).map((el) =>
    el.closest(".status-card")
  );

  const green = statusCards.find((el) =>
    el?.querySelector(".status-indicator.green")
  );
  const orange = statusCards.find((el) =>
    el?.querySelector(".status-indicator.orange")
  );
  const red = statusCards.find((el) =>
    el?.querySelector(".status-indicator.red")
  );

  expect(green).toBeInTheDocument();
  expect(orange).toBeInTheDocument();
  expect(red).toBeInTheDocument();
});
