import React, { useState } from "react";
import axios from "axios";
//import "./Form.css";

export default function AddUser() {
  const [formData, setFormData] = useState({
    id: "", // ת"ז
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    role: "student",
    department: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3006/users/add-user", formData);
      alert("משתמש נוסף בהצלחה");
    } catch (err) {
      alert("שגיאה בהוספת משתמש");
    }
  };

  return (
    <div className="form-container">
      <h2>הוספת משתמש חדש</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="id"
          placeholder="תעודת זהות"
          onChange={handleChange}
          required
        />
        <input
          name="username"
          placeholder="שם משתמש"
          onChange={handleChange}
          required
        />
        <input
          name="firstname"
          placeholder="שם פרטי"
          onChange={handleChange}
          required
        />
        <input
          name="lastname"
          placeholder="שם משפחה"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="סיסמה"
          onChange={handleChange}
          required
        />
        <select name="role" onChange={handleChange}>
          <option value="student">סטודנט</option>
          <option value="staff">סגל</option>
          <option value="admin">מנהל</option>
        </select>
        <input
          name="department"
          placeholder="מחלקה"
          onChange={handleChange}
          required
        />
        <button type="submit">הוסף</button>
      </form>
    </div>
  );
}
