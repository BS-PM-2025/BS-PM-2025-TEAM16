import React, { useState } from "react";
import axios from "axios";
import "./Form.css";

const StaffStudentSearchBox = () => {
  const [searchId, setSearchId] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3006/users/by-id/${searchId}`);
      setStudentDetails(res.data);
      setSearchError("");
    } catch (err) {
      setStudentDetails(null);
      setSearchError("לא נמצא סטודנט עם התעודה הזו");
    }
  };

  return (
    <div className="form-container" style={{ marginBottom: "30px" }}>
      <h3>חיפוש סטודנט לפי ת״ז</h3>
      <input
        placeholder="הכנס תעודת זהות של סטודנט"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button onClick={handleSearch}>חפש</button>

      {searchError && <p style={{ color: "red" }}>{searchError}</p>}

      {studentDetails && (
        <div className="student-info">
          <p><strong>שם פרטי:</strong> {studentDetails.firstname}</p>
          <p><strong>שם משפחה:</strong> {studentDetails.lastname}</p>
          <p><strong>שם משתמש:</strong> {studentDetails.username}</p>
          <p><strong>אימייל:</strong> {studentDetails.email}</p>
          <p><strong>תפקיד:</strong> {studentDetails.role}</p>
          <p><strong>מחלקה:</strong> {studentDetails.department}</p>
          {studentDetails.employeeId && (
            <p><strong>employeeId:</strong> {studentDetails.employeeId}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffStudentSearchBox;
