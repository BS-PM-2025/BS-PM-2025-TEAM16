import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentRequestForm from "../StudentRequestForm";

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(
    "projectFS",
    JSON.stringify({ user: { _id: "123", username: "student1" } })
  );

  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ _id: "2", name: "דחיית הגשת עבודה" }],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ _id: "1", name: "מבוא לקומפילציה" }],
    })
    .mockResolvedValueOnce({
      ok: true,
      text: async () => "",
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

  const confirmBtn = await screen.findByText("אישור");
  fireEvent.click(confirmBtn);

  await waitFor(() =>
    expect(screen.getByText("בקשתך נשלחה בהצלחה!")).toBeInTheDocument()
  );

  fireEvent.click(screen.getByText("סגור"));
  await waitFor(() =>
    expect(screen.queryByText("בקשתך נשלחה בהצלחה!")).not.toBeInTheDocument()
  );
});
