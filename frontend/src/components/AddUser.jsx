import React, { useState } from "react";
import axios from "axios";
import "./AddUserForm.css";

export default function AddUser() {
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    role: "",
    position: "",
    department: "",
    email: "",
    employeeId: "",
    startYear: "",
  });

  const handleChange = (e) => {
  const { name, value } = e.target;
  const numericFields = ["startYear"];
  const processedValue = numericFields.includes(name) ? Number(value) : value;

  setFormData({ ...formData, [name]: processedValue });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // בדיקת שדות חובה
  const requiredFields = ["id", "username", "firstname", "lastname", "password", "role", "department", "email"];
  const isValid = requiredFields.every((field) => formData[field]);
  if (!isValid) {
    alert("יש למלא את כל שדות החובה");
    return;
  }

  const payload = {
    ...formData,
    startYear: formData.startYear ? Number(formData.startYear) : undefined,
    employeeId: formData.employeeId?.toString() || "",
  };

  try {
    console.log("Sending:", formData);
    await axios.post("http://localhost:3006/users/add-user", payload);
    alert("משתמש נוסף בהצלחה");


    setFormData({
      id: "",
      username: "",
      firstname: "",
      lastname: "",
      password: "",
      role: "",
      position: "",
      department: "",
      email: "",
      employeeId: "",
      startYear: "",
    });
  } catch (err) {
    alert("שגיאה בהוספת משתמש");
  }
};

  return (
    <div className="form-container">
      <h2>הוספת משתמש חדש</h2>
      <form onSubmit={handleSubmit}>
        <input name="id" value={formData.id} placeholder="תעודת זהות" onChange={handleChange} required />
        <input name="username" value={formData.username} placeholder="שם משתמש" onChange={handleChange} required />
        <input name="firstname" value={formData.firstname} placeholder="שם פרטי" onChange={handleChange} required />
        <input name="lastname"  value={formData.lastnamename} placeholder="שם משפחה" onChange={handleChange} required />
        <input name="password" value={formData.password} type="password" placeholder="סיסמה" onChange={handleChange} required />
        <select name="role" onChange={handleChange} required>
          <option value="student">סטודנט</option>
          <option value="staff">סגל</option>
          <option value="admin">מנהל</option>
        </select>
        <input name="position" value={formData.position} placeholder="תפקיד (אם רלוונטי)" onChange={handleChange} />
        <input name="department" value={formData.department} placeholder="מחלקה" onChange={handleChange} required />
        <input name="email" value={formData.email} type="email" placeholder="דוא״ל" onChange={handleChange} required />
        <input name="employeeId" value={formData.employeeId} placeholder="מספר עובד" onChange={handleChange} />
        <input name="startYear" value={formData.startYear} type="number" placeholder="שנת התחלה" onChange={handleChange} />
        <button type="submit">הוסף</button>
      </form>
    </div>
  );
}
