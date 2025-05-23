import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentRequestForm from "../StudentRequestForm";

// נחליף את fetch ל־mock
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(
    "projectFS",
    JSON.stringify({ user: { _id: "123", username: "student1" } })
  );

  global.fetch = jest.fn()
    // קריאה ראשונה: topics
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: "2", name: "דחיית הגשת עבודה" }
      ],
    })
    // קריאה שנייה: courses
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: "1", name: "מבוא לקומפילציה" }
      ],
    })
    // קריאה שלישית: שליחת בקשה
    .mockResolvedValueOnce({
      ok: true,
      text: async () => "", // במקרה של שגיאה – שלא יתרסק
    });
});

test("מציג את המודל לאחר שליחה מוצלחת", async () => {
  render(<StudentRequestForm />);

  const startBtn = await screen.findByText("יצירת בקשת סטודנט");
  fireEvent.click(startBtn);

  const selects = await screen.findAllByRole("combobox");
  fireEvent.change(selects[0], { target: { value: "2" } }); // נושא
  fireEvent.change(selects[1], { target: { value: "1" } }); // קורס

  const textarea = screen.getByRole("textbox");
  fireEvent.change(textarea, { target: { value: "אני מבקש דחייה" } });

  const submitBtn = screen.getByText("שלח בקשה");
  fireEvent.click(submitBtn);

  // בדיקה אם המודל מופיע
  await waitFor(() =>
    expect(screen.getByText("בקשתך נשלחה בהצלחה!")).toBeInTheDocument()
  );

  // בדיקה של סגירת המודל
  fireEvent.click(screen.getByText("סגור"));
  await waitFor(() =>
    expect(screen.queryByText("בקשתך נשלחה בהצלחה!")).not.toBeInTheDocument()
  );
});
