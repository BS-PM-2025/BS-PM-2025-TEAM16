import React from "react";
import { render, screen } from "@testing-library/react";
import StudentStatus from "../StudentStatus";

const mockRequests = [
  {
    status: "אושר",
    submissionDate: "2025-05-23T09:51:46.240+00:00",
    requestType: { name: "דחיית הגשת עבודה" },
  },
  {
    status: "ממתין",
    submissionDate: "2025-05-23T09:51:46.240+00:00",
    requestType: { name: "אחר" },
  },
  {
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

  expect(screen.getByText("אושר")).toBeInTheDocument();
  expect(screen.getByText("ממתין")).toBeInTheDocument();
  expect(screen.getByText("נדחה")).toBeInTheDocument();
});

test("status - correct color class", () => {
  render(<StudentStatus requests={mockRequests} />);

  const approvedCard = screen.getByText("אושר").closest(".status-card");
  const pendingCard = screen.getByText("ממתין").closest(".status-card");
  const rejectedCard = screen.getByText("נדחה").closest(".status-card");

  expect(approvedCard.querySelector(".status-indicator")).toHaveClass("green");
  expect(pendingCard.querySelector(".status-indicator")).toHaveClass("orange");
  expect(rejectedCard.querySelector(".status-indicator")).toHaveClass("red");
});
