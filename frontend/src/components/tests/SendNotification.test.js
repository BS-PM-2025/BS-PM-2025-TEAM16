import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SendNotification from "../SendNotification";

// מנקה ומרגל על alert ו־console
beforeEach(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("SendNotification", () => {
  test("מציג שדות וכפתור", () => {
    render(<SendNotification />);
    expect(screen.getByPlaceholderText("כותרת ההודעה")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("תוכן ההודעה...")).toBeInTheDocument();
    expect(screen.getByText("שלח הודעה")).toBeInTheDocument();
  });

  test("לא שולח אם אחד השדות ריק", async () => {
    render(<SendNotification />);
    fireEvent.change(screen.getByPlaceholderText("כותרת ההודעה"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText("תוכן ההודעה..."), {
      target: { value: "שלום!" },
    });
    fireEvent.click(screen.getByText("שלח הודעה"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("נא למלא גם כותרת וגם תוכן ההודעה");
    });
  });

  test("שולח הודעה בהצלחה", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
    });

    render(<SendNotification />);
    fireEvent.change(screen.getByPlaceholderText("כותרת ההודעה"), {
      target: { value: "בדיקה" },
    });
    fireEvent.change(screen.getByPlaceholderText("תוכן ההודעה..."), {
      target: { value: "זהו תוכן הודעה" },
    });
    fireEvent.click(screen.getByText("שלח הודעה"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("ההודעה נשלחה בהצלחה");
    });

    // בודק שנוקה
    expect(screen.getByPlaceholderText("כותרת ההודעה").value).toBe("");
    expect(screen.getByPlaceholderText("תוכן ההודעה...").value).toBe("");
  });

  test("מציג שגיאה כאשר fetch נכשל (res.ok === false)", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
    });

    render(<SendNotification />);
    fireEvent.change(screen.getByPlaceholderText("כותרת ההודעה"), {
      target: { value: "כותרת" },
    });
    fireEvent.change(screen.getByPlaceholderText("תוכן ההודעה..."), {
      target: { value: "תוכן" },
    });
    fireEvent.click(screen.getByText("שלח הודעה"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("שגיאה בשליחת ההודעה");
    });
  });

  test("מציג שגיאה בקונסולה וב־alert כשיש תקלה בשרת", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network Error"));

    render(<SendNotification />);
    fireEvent.change(screen.getByPlaceholderText("כותרת ההודעה"), {
      target: { value: "כותרת" },
    });
    fireEvent.change(screen.getByPlaceholderText("תוכן ההודעה..."), {
      target: { value: "תוכן" },
    });
    fireEvent.click(screen.getByText("שלח הודעה"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error sending message:",
        expect.any(Error)
      );
      expect(window.alert).toHaveBeenCalledWith("שגיאה בשרת");
    });
  });
});
