import React, { useState } from "react";
import axios from "axios";
//import "./Form.css";

export default function EditUserRole() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("student");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3006/users/update-role/${userId}`, {
        role,
        firstname,
        lastname,
      });
      alert("התפקיד עודכן בהצלחה");
    } catch (err) {
      alert("שגיאה בעדכון תפקיד");
    }
  };

  return (
    <div className="form-container">
      <h2>עריכת תפקיד משתמש</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="תעודת זהות / מזהה"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          placeholder="שם פרטי"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
        <input
          placeholder="שם משפחה"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Student">סטודנט</option>
          <option value="Staff">סגל</option>
          <option value="Admin">מנהל</option>
        </select>
        <button type="submit">שמור</button>
      </form>
    </div>
  );
}
