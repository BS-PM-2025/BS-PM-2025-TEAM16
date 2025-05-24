import React, { useEffect, useState } from "react";
import axios from "axios";
import { getFromLocalStorage } from "../utils/services";
import "./StudentRequestsTable.css";

const StudentRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const data = getFromLocalStorage("projectFS");

    if (data?.user?.username) {
      const url = `http://localhost:3006/api/student/requests?studentUsername=${data.user.username}`;

      axios
        .get(url)
        .then((res) => {
          setRequests(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error loading student requests:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="requests-box" dir="rtl">
      <h3>הבקשות שהגשת:</h3>

      {isLoading ? (
        <p>טוען בקשות...</p>
      ) : (
        <table border="1" className="requests-table">
          <thead>
            <tr>
              <th>נושא הבקשה</th>
              <th>קורס</th>
              <th>סטטוס</th>
              <th>תאריך הגשה</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="4">לא קיימות בקשות</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req._id}
                  onClick={() => setSelectedRequest(req)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{req.requestType?.name || "—"}</td>
                  <td>{req.course?.name || "—"}</td>
                  <td className={req.status}>
                    <span className="status-text">{req.status}</span>
                  </td>
                  <td>{new Date(req.submissionDate).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {selectedRequest && (
        <div className="request-details-box">
          <h2>פרטי הבקשה</h2>
          <p>
            <strong>קורס:</strong> {selectedRequest.course?.name}
          </p>
          <p>
            <strong>נושא:</strong> {selectedRequest.requestType?.name}
          </p>
          <p>
            <strong>תיאור הבקשה:</strong> {selectedRequest.description || "—"}
          </p>
          <p>
            <strong>הערת סגל:</strong>{" "}
            {selectedRequest.staffComments?.length > 0
              ? selectedRequest.staffComments[
                  selectedRequest.staffComments.length - 1
                ].comment
              : "אין הערות"}
          </p>

          <p>
            <strong>סטטוס:</strong> {selectedRequest.status}
          </p>
          <p>
            <strong>תאריך הגשה:</strong>{" "}
            {new Date(selectedRequest.submissionDate).toLocaleDateString()}
          </p>

          <div style={{ marginTop: "1em" }}>
            <button
              className="close-button"
              onClick={() => setSelectedRequest(null)}
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRequestsTable;
