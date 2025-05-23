import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StudentRequestForm from "../StudentRequestForm";

test("back button", () => {
  render(<StudentRequestForm />);

  const startButton = screen.getByText("יצירת בקשת סטודנט");
  expect(startButton).toBeInTheDocument();

  fireEvent.click(startButton);

  expect(screen.getByText("שלח בקשה")).toBeInTheDocument();
  expect(screen.getByText("חזור")).toBeInTheDocument();

  fireEvent.click(screen.getByText("חזור"));

  expect(screen.queryByText("שלח בקשה")).not.toBeInTheDocument();

  expect(screen.getByText("יצירת בקשת סטודנט")).toBeInTheDocument();
});
