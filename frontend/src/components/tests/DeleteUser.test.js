import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteUser from "../DeleteUser";
import axios from "axios";

jest.mock("axios");
beforeAll(() => {
  window.alert = jest.fn();
});

describe("DeleteUser", () => {
  test("should show confirmation modal", async () => {
    render(<DeleteUser />);
    fireEvent.change(screen.getByPlaceholderText("תעודת זהות"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("שם פרטי"), {
      target: { value: "ישראל" },
    });
    fireEvent.change(screen.getByPlaceholderText("שם משפחה"), {
      target: { value: "כהן" },
    });

    fireEvent.click(screen.getByText("מחק"));
    expect(await screen.findByText(/האם את\/ה בטוח/)).toBeInTheDocument();
  });

  test("calls API on confirm", async () => {
    axios.delete.mockResolvedValueOnce({});
    render(<DeleteUser />);
    fireEvent.change(screen.getByPlaceholderText("תעודת זהות"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("שם פרטי"), {
      target: { value: "ישראל" },
    });
    fireEvent.change(screen.getByPlaceholderText("שם משפחה"), {
      target: { value: "כהן" },
    });

    fireEvent.click(screen.getByText("מחק"));
    fireEvent.click(await screen.findByText("כן"));

    await waitFor(() =>
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:3006/api/users/by-id/123456789"
      )
    );
  });
});
