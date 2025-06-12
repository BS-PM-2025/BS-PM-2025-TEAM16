import React from "react";
import { render } from "@testing-library/react";
import StaffRequestDetailsBox from "../StaffRequestDetailsBox";

test("מרנדר את הרכיב StaffRequestDetailsBox בלי קריסה", () => {
  const mockRequest = {
    _id: "123",
    student: { fullName: "Test Student" },
    course: { name: "Course A" },
    requestType: { name: "Type A" },
    status: "ממתין",
    submissionDate: "2025-06-10T12:00:00.000Z",
    staffComments: [],
    staff: { fullName: "מרצה בדיקה" },
  };

  const { container } = render(<StaffRequestDetailsBox request={mockRequest} />);
  expect(container).toBeDefined(); 
});
