import React, { useEffect, useState } from "react";
import axios from "axios";
//import "./Form.css";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3006/users/all-users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("שגיאה בטעינת המשתמשים", err));
  }, []);

  return (
    <div className="form-container">
      <h2>רשימת משתמשים</h2>
      <table>
        <thead>
          <tr>
            <th>ת"ז</th>
            <th>שם פרטי</th>
            <th>שם משפחה</th>
            <th>תפקיד</th>
            <th>מחלקה</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.id}</td>
              <td>{u.firstname}</td>
              <td>{u.lastname}</td>
              <td>{u.role}</td>
              <td>{u.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
