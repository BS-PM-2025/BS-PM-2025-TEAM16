import React, { useState } from "react";
import axios from "axios";
//import "./Form.css";

export default function StudentDetails() {
  const [username, setUsername] = useState("");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3006/users/by-username/${username}`
      );
      setDetails(res.data);
      setError("");
    } catch (err) {
      setDetails(null);
      setError("לא נמצאו פרטים עבור שם המשתמש הזה.");
    }
  };

  return (
    <div className="form-container">
      <h2>פרטי סטודנט</h2>
      <input
        placeholder="שם משתמש של הסטודנט"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSearch}>חפש</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {details && (
        <div className="student-info">
          <p>
            <strong>שם פרטי:</strong> {details.firstname}
          </p>
          <p>
            <strong>שם משפחה:</strong> {details.lastname}
          </p>
          <p>
            <strong>תפקיד:</strong> {details.role}
          </p>
          <p>
            <strong>מחלקה:</strong> {details.department}
          </p>
        </div>
      )}
    </div>
  );
}
