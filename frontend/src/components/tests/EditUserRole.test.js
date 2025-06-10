import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditUserRole from "../EditUserRole";
import axios from "axios";

jest.mock("axios");
beforeEach(() => {
  window.alert = jest.fn();
});
test("מעדכן תפקיד משתמש בהצלחה", async () => {
  axios.put.mockResolvedValue({});

  render(<EditUserRole />);
  fireEvent.change(screen.getByPlaceholderText("תעודת זהות / מזהה"), { target: { value: "123456789" } });
  fireEvent.change(screen.getByPlaceholderText("שם פרטי"), { target: { value: "דני" } });
  fireEvent.change(screen.getByPlaceholderText("שם משפחה"), { target: { value: "כהן" } });
  fireEvent.change(screen.getByDisplayValue("סטודנט"), { target: { value: "Admin" } });

  fireEvent.click(screen.getByText("שמור"));

  await waitFor(() => {
    expect(axios.put).toHaveBeenCalledWith(
      "http://localhost:3006/users/update-role/123456789",
      { role: "Admin", firstname: "דני", lastname: "כהן" }
    );
  });
});
