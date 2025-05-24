import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddUser from "../AddUser";
import axios from "axios";

jest.mock("axios");
beforeEach(() => {
  window.alert = jest.fn();
});
test("מוסיף משתמש חדש", async () => {
  axios.post.mockResolvedValue({});

  render(<AddUser />);
  fireEvent.change(screen.getByPlaceholderText("שם פרטי"), { target: { value: "רן" } });
  fireEvent.change(screen.getByPlaceholderText("שם משפחה"), { target: { value: "סבג" } });
  fireEvent.change(screen.getByPlaceholderText("תעודת זהות"), { target: { value: "111111111" } });

  fireEvent.click(screen.getByRole("button", { name: "הוסף" }));

  await waitFor(() =>
    expect(axios.post).toHaveBeenCalled()
  );
});
