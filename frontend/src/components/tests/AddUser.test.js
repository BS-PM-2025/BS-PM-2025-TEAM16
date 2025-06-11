import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddUser from "../AddUser";
import axios from "axios";

jest.mock("axios");

beforeEach(() => {
  window.alert = jest.fn(); // כדי להימנע מהופעת חלונות alert אמיתיים
});

test("מראה את כל שדות הטופס", () => {
  render(<AddUser />);
  expect(screen.getByPlaceholderText("תעודת זהות")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("שם משתמש")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("שם פרטי")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("שם משפחה")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("סיסמה")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("מחלקה")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("דוא״ל")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("מספר עובד")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("שנת התחלה")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("תפקיד (אם רלוונטי)")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "הוסף" })).toBeInTheDocument();
});

test("מוסיף משתמש חדש בהצלחה", async () => {
  axios.post.mockResolvedValue({});

  render(<AddUser />);
  fireEvent.change(screen.getByPlaceholderText("תעודת זהות"), { target: { value: "111111111" } });
  fireEvent.change(screen.getByPlaceholderText("שם משתמש"), { target: { value: "ran123" } });
  fireEvent.change(screen.getByPlaceholderText("שם פרטי"), { target: { value: "רן" } });
  fireEvent.change(screen.getByPlaceholderText("שם משפחה"), { target: { value: "סבג" } });
  fireEvent.change(screen.getByPlaceholderText("סיסמה"), { target: { value: "pass1234" } });
  fireEvent.change(screen.getByPlaceholderText("מחלקה"), { target: { value: "מדעי המחשב" } });
  fireEvent.change(screen.getByPlaceholderText("דוא״ל"), { target: { value: "ran@example.com" } });
  fireEvent.change(screen.getByPlaceholderText("מספר עובד"), { target: { value: "9876" } });
  fireEvent.change(screen.getByPlaceholderText("שנת התחלה"), { target: { value: "2024" } });
  fireEvent.change(screen.getByPlaceholderText("תפקיד (אם רלוונטי)"), { target: { value: "רכז" } });
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "staff" } });

  fireEvent.click(screen.getByRole("button", { name: "הוסף" }));

  await waitFor(() => expect(axios.post).toHaveBeenCalled());
  expect(window.alert).toHaveBeenCalledWith("משתמש נוסף בהצלחה");
});

test("מציג alert שגיאה כשהשליחה נכשלת", async () => {
  axios.post.mockRejectedValueOnce(new Error("Network error"));

  render(<AddUser />);
  fireEvent.change(screen.getByPlaceholderText("תעודת זהות"), { target: { value: "111111111" } });
  fireEvent.change(screen.getByPlaceholderText("שם משתמש"), { target: { value: "ran123" } });
  fireEvent.change(screen.getByPlaceholderText("שם פרטי"), { target: { value: "רן" } });
  fireEvent.change(screen.getByPlaceholderText("שם משפחה"), { target: { value: "סבג" } });
  fireEvent.change(screen.getByPlaceholderText("סיסמה"), { target: { value: "pass1234" } });
  fireEvent.change(screen.getByPlaceholderText("מחלקה"), { target: { value: "מדעי המחשב" } });
  fireEvent.change(screen.getByPlaceholderText("דוא״ל"), { target: { value: "ran@example.com" } });
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "student" } });

  fireEvent.click(screen.getByRole("button", { name: "הוסף" }));

  await waitFor(() => expect(window.alert).toHaveBeenCalledWith("שגיאה בהוספת משתמש"));
});
test("לא שולח אם שדות חובה ריקים", async () => {
  render(<AddUser />);
  fireEvent.change(screen.getByPlaceholderText("שם משתמש"), { target: { value: "testuser" } });
  fireEvent.click(screen.getByRole("button", { name: "הוסף" }));
  await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
});
test("מאפשר הוספת סטודנט ללא שדות staff", async () => {
  axios.post.mockResolvedValue({});

  render(<AddUser />);
  fireEvent.change(screen.getByPlaceholderText("תעודת זהות"), { target: { value: "123123123" } });
  fireEvent.change(screen.getByPlaceholderText("שם משתמש"), { target: { value: "student1" } });
  fireEvent.change(screen.getByPlaceholderText("שם פרטי"), { target: { value: "דנה" } });
  fireEvent.change(screen.getByPlaceholderText("שם משפחה"), { target: { value: "כהן" } });
  fireEvent.change(screen.getByPlaceholderText("סיסמה"), { target: { value: "pass" } });
  fireEvent.change(screen.getByPlaceholderText("מחלקה"), { target: { value: "ביולוגיה" } });
  fireEvent.change(screen.getByPlaceholderText("דוא״ל"), { target: { value: "dana@example.com" } });
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "student" } });

  fireEvent.click(screen.getByRole("button", { name: "הוסף" }));
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
});
test("מאפס שדות לאחר שליחה מוצלחת", async () => {
  axios.post.mockResolvedValue({});
  render(<AddUser />);
  const idInput = screen.getByPlaceholderText("תעודת זהות");

  fireEvent.change(idInput, { target: { value: "123456789" } });
  fireEvent.change(screen.getByPlaceholderText("שם משתמש"), { target: { value: "aaa" } });
  fireEvent.change(screen.getByPlaceholderText("שם פרטי"), { target: { value: "bbb" } });
  fireEvent.change(screen.getByPlaceholderText("שם משפחה"), { target: { value: "ccc" } });
  fireEvent.change(screen.getByPlaceholderText("סיסמה"), { target: { value: "pass" } });
  fireEvent.change(screen.getByPlaceholderText("מחלקה"), { target: { value: "xxx" } });
  fireEvent.change(screen.getByPlaceholderText("דוא״ל"), { target: { value: "abc@abc.com" } });
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "student" } });

  fireEvent.click(screen.getByRole("button", { name: "הוסף" }));

  await waitFor(() => expect(idInput.value).toBe(""));
});
