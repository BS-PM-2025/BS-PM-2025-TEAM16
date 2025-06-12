import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserList from "../UserList";
import axios from "axios";

jest.mock("axios");

const mockUsers = [
  {
    id: "123456789",
    firstname: "נועה",
    lastname: "כהן",
    username: "noa",
    role: "סטודנט",
    department: "הנדסת תוכנה",
    email: "noa@example.com",
  },
  {
    id: "987654321",
    firstname: "יוסי",
    lastname: "לוי",
    username: "yossi",
    role: "סגל",
    department: "מדעי המחשב",
    email: "yossi@example.com",
    employeeId: "EMP001",
  },
];

beforeEach(() => {
  axios.get.mockResolvedValue({ data: mockUsers });
});

test("חיפוש לפי שם או ת\"ז", async () => {
  render(<UserList />);
  await screen.findByText("נועה");

  fireEvent.change(screen.getByPlaceholderText("חיפוש לפי שם / משפחה / ת״ז"), {
    target: { value: "987654321" },
  });

  expect(screen.getByText("יוסי")).toBeInTheDocument();
  expect(screen.queryByText("נועה")).not.toBeInTheDocument();
});

test("סינון לפי role", async () => {
  render(<UserList />);
  await screen.findByText("סטודנט");

  fireEvent.click(screen.getAllByText("▼")[0]); // תפקיד
  await waitFor(() => screen.getByLabelText("סטודנט"));
  fireEvent.click(screen.getByLabelText("סטודנט"));

  expect(screen.getByText("נועה")).toBeInTheDocument();
  expect(screen.queryByText("יוסי")).not.toBeInTheDocument();
});

test("סינון לפי מחלקה", async () => {
  render(<UserList />);
  await screen.findByText("מדעי המחשב");

  fireEvent.click(screen.getAllByText("▼")[1]); // מחלקה
  await waitFor(() => screen.getByLabelText("מדעי המחשב"));
  fireEvent.click(screen.getByLabelText("מדעי המחשב"));

  expect(screen.getByText("יוסי")).toBeInTheDocument();
  expect(screen.queryByText("נועה")).not.toBeInTheDocument();
});

test("איפוס מחזיר את כל המשתמשים", async () => {
  render(<UserList />);
  await screen.findByText("יוסי");

  fireEvent.change(screen.getByPlaceholderText("חיפוש לפי שם / משפחה / ת״ז"), {
    target: { value: "נועה" },
  });

  expect(screen.getByText("נועה")).toBeInTheDocument();
  expect(screen.queryByText("יוסי")).not.toBeInTheDocument();

  fireEvent.click(screen.getByText("איפוס"));

  expect(await screen.findByText("יוסי")).toBeInTheDocument();
  expect(screen.getByText("נועה")).toBeInTheDocument();
});

test("מציג הודעת שגיאה אם הבקשה לשרת נכשלת", async () => {
  axios.get.mockRejectedValue(new Error("Network Error"));

  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<UserList />);

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalled();
  });

  consoleSpy.mockRestore();
});

test("מציג את כל המשתמשים כשאין סינון", async () => {
  render(<UserList />);
  expect(await screen.findByText("נועה")).toBeInTheDocument();
  expect(screen.getByText("יוסי")).toBeInTheDocument();
});

// ✅ טסט חדש – פתיחה וסגירה של שורת פרטי משתמש
test("לחיצה על שורה פותחת וסוגרת פרטי משתמש", async () => {
  render(<UserList />);
  const userRow = await screen.findByText("יוסי");
  fireEvent.click(userRow.closest("tr"));

  expect(screen.getByText(/שם משתמש:/)).toBeInTheDocument();
  expect(screen.getByText("yossi")).toBeInTheDocument();

  fireEvent.click(userRow.closest("tr"));
  await waitFor(() => {
    expect(screen.queryByText("yossi")).not.toBeInTheDocument();
  });
});
