import { render, screen, fireEvent } from "@testing-library/react";
import RequestSentModal from "../RequestSentModal";

test("מציג את המודל עם תאריך וסוגר בלחיצה", () => {
  const handleClose = jest.fn();
  const testDate = new Date("2025-05-26");

  render(<RequestSentModal expectedDate={testDate} onClose={handleClose} />);

  expect(screen.getByText("בקשתך נשלחה בהצלחה!")).toBeInTheDocument();
  expect(screen.getByText((text) => text.includes("26.05.2025"))).toBeInTheDocument();
  expect(screen.getByText(/צפי למענה עד/)).toBeInTheDocument();

  fireEvent.click(screen.getByText("סגור"));
  expect(handleClose).toHaveBeenCalled();
});
