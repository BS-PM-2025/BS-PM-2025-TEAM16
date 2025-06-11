import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotificationBox from "../NotificationBox";

// מוודא שאין שגיאות קונסולה בזמן הריצה
beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("NotificationBox", () => {
  test("מציג כפתור ראשי עם הטקסט המתאים", () => {
    render(<NotificationBox />);
    expect(screen.getByText("הצג הודעות מערכת")).toBeInTheDocument();
  });

  test("מציג הודעה על חוסר הודעות", async () => {
    // מחזיר רשימה ריקה
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: async () => [],
    });

    render(<NotificationBox />);
    fireEvent.click(screen.getByText("הצג הודעות מערכת"));

    await waitFor(() => {
      expect(screen.getByText("אין הודעות להצגה")).toBeInTheDocument();
    });
  });

  test("מציג הודעה אחת אם יש הודעה במערכת", async () => {
    const fakeData = [
      {
        title: "בדיקת מערכת",
        message: "הודעת בדיקה",
        createdAt: new Date().toISOString(),
      },
    ];

    jest.spyOn(global, "fetch").mockResolvedValue({
      json: async () => fakeData,
    });

    render(<NotificationBox />);
    fireEvent.click(screen.getByText("הצג הודעות מערכת"));

    await waitFor(() => {
      expect(screen.getByText("בדיקת מערכת")).toBeInTheDocument();
      expect(screen.getByText("הודעת בדיקה")).toBeInTheDocument();
    });
  });

  test("מציג 'טוען...' כאשר הנתונים נטענים", async () => {
    let resolveFetch;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    jest.spyOn(global, "fetch").mockReturnValue(fetchPromise);

    render(<NotificationBox />);
    fireEvent.click(screen.getByText("הצג הודעות מערכת"));

    expect(screen.getByText("טוען...")).toBeInTheDocument();

    // השלמת הבקשה
    resolveFetch({
      json: async () => [],
    });

    await waitFor(() => {
      expect(screen.getByText("אין הודעות להצגה")).toBeInTheDocument();
    });
  });

  test("כפתור סוגר את ההודעות בלחיצה שנייה", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: async () => [],
    });

    render(<NotificationBox />);
    const button = screen.getByText("הצג הודעות מערכת");

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("אין הודעות להצגה")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("סגור הודעות מערכת"));
    expect(screen.queryByText("אין הודעות להצגה")).not.toBeInTheDocument();
  });

  test("מטפל במקרה שבו המידע אינו מערך", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({ msg: "לא מערך" }),
    });

    render(<NotificationBox />);
    fireEvent.click(screen.getByText("הצג הודעות מערכת"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Data is not an array", { msg: "לא מערך" });
    });
  });
});
