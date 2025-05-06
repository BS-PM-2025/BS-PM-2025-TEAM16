import React, { useEffect, useState } from "react";
import axios from "axios";
import { getFromLocalStorage } from "../utils/services";
//import "./Form.css";

export default function DepartmentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getFromLocalStorage("projectFS");
    if (!userData || !userData.user?.department) {
      setRequests([]);
      setLoading(false);
      return;
    }

    axios
      .get(
        `http://localhost:3006/api/staff/department-requests?department=${userData.user.department}`
      )
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("שגיאה בשליפת בקשות לפי מחלקה:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="form-container">
      <h2>בקשות לפי המחלקה שלי:</h2>
      {loading ? (
        <p>טוען נתונים...</p>
      ) : requests.length === 0 ? (
        <p>לא קיימות בקשות במחלקה שלך</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>שם סטודנט</th>
              <th>ת"ז</th>
              <th>סוג בקשה</th>
              <th>קורס</th>
              <th>סטטוס</th>
              <th>תאריך</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>
                  {req.student?.firstname} {req.student?.lastname}
                </td>
                <td>{req.student?.id}</td>
                <td>{req.requestType?.name}</td>
                <td>{req.course?.name}</td>
                <td>{req.status}</td>
                <td>{new Date(req.submissionDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
