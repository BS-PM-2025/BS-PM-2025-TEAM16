import React from "react";
import { ID_PLACEHOLDER } from "./Staff";

const StaffRequestFilters = ({
  statusFilter,
  setStatusFilter,
  studentIdFilter,
  setStudentIdFilter,
}) => {
  return (
    <div className="status-container">
      <label htmlFor="status-select" className="status-label">
        סינון לפי סטטוס:
      </label>
      <select
        id="status-select"
        className="status-select"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        disabled={studentIdFilter !== ""}
      >
        <option value="">הצג הכל</option>
        <option value="ממתין">ממתין</option>
        <option value="אושר">אושר</option>
        <option value="נדחה">נדחה</option>
      </select>

      <label htmlFor="student-id-input" className="status-label">
        הזן תעודת זהות לסינון:
      </label>
      <input
        id="student-id-input"
        type="text"
        placeholder={ID_PLACEHOLDER}
        className="id-input"
        value={studentIdFilter}
        onChange={(e) => setStudentIdFilter(e.target.value)}
      />
    </div>
  );
};
export default StaffRequestFilters;
