import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header";
import { getFromLocalStorage } from "../utils/services";
import "./Welcome.css";

const Staff = () => {
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ממתין");
  const [studentIdFilter, setStudentIdFilter] = useState("");
  useEffect(() => {
    const data = getFromLocalStorage("projectFS");
    setUserData(data);

    if (data?.user?.username) {
      let url = `http://localhost:3006/api/staff/requests/by-status-and-staff?staffUsername=${data.user.username}&status=${statusFilter}`;

      if (studentIdFilter) {
        url = `http://localhost:3006/api/staff/requests/by-student-id?studentId=${studentIdFilter}`;
      }

      axios
        .get(
          url,

          {
            headers: {
              "user-role": "Staff",
            },
          }
        )
        .then((res) => {
          setRequests(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error loading staff requests:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [statusFilter, studentIdFilter]);

  const handleApprove = (id) => {
    axios
      .put(`http://localhost:3006/api/staff/requests/approve/${id}`)
      .then(() => {
        alert("הבקשה אושרה");
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === id ? { ...req, status: "אושר" } : req
          )
        );
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: "אושר" } : prev
        );
      })
      .catch(() => alert("שגיאה באישור הבקשה"));
  };

  const handleReject = (id) => {
    axios
      .put(`http://localhost:3006/api/staff/requests/reject/${id}`)
      .then(() => {
        alert("הבקשה נדחתה");
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === id ? { ...req, status: "נדחה" } : req
          )
        );
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: "נדחה" } : prev
        );
      })
      .catch(() => alert("שגיאה בדחיית הבקשה"));
  };

  return (
    <div className="welcome" dir="rtl">
      <div className="welcome-page-container">
        <Header />

        {userData && (
          <div className="welcome-header-box">
            <h2> ברוך הבא לאזור האישי שלך {userData.user.username}</h2>
          </div>
        )}

        <div className="requests-box">
          <h3>בקשות סטודנטים לטיפולך:</h3>

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
              placeholder="הקלד ת.ז של סטודנט"
              className="id-input"
              value={studentIdFilter}
              onChange={(e) => setStudentIdFilter(e.target.value)}
            />
          </div>

          {isLoading ? (
            <p>...טוען בקשות</p>
          ) : (
            <table border="1" className="requests-table">
              <thead>
                <tr>
                  <th>שם הסטודנט</th>
                  <th>ת.ז</th>
                  <th>נושא הבקשה</th>
                  <th>קורס</th>
                  <th>סטטוס</th>
                  <th>תאריך הגשה</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="6">לא קיימות בקשות בסטטוס {statusFilter}</td>
                  </tr>
                ) : (
                  requests.map((req) =>
                    req.student && req.staff ? (
                      <tr
                        key={req._id}
                        onClick={() => setSelectedRequest(req)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>
                          {req.student.firstname} {req.student.lastname}
                        </td>
                        <td>{req.student.id}</td>
                        <td>{req.requestType?.name || "—"}</td>
                        <td>{req.course?.name || "—"}</td>
                        <td>{req.status}</td>
                        <td>
                          {new Date(req.submissionDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ) : null
                  )
                )}
              </tbody>
            </table>
          )}
        </div>

        {selectedRequest && (
          <div className="request-details-box">
            <h2>פרטי הבקשה</h2>
            <p>
              <strong>שם הסטודנט:</strong> {selectedRequest.student.firstname}{" "}
              {selectedRequest.student.lastname}
            </p>
            <p>
              <strong>קורס:</strong> {selectedRequest.course?.name}
            </p>
            <p>
              <strong>נושא:</strong> {selectedRequest.requestType?.name}
            </p>
            <p>
              <strong>תיאור הבקשה:</strong> {selectedRequest.description}
            </p>
            <p>
              <strong>סטטוס:</strong> {selectedRequest.status}
            </p>
            <p>
              <strong>תאריך הגשה:</strong>{" "}
              {new Date(selectedRequest.submissionDate).toLocaleDateString()}
            </p>

            {selectedRequest.staffComments.length > 0 && (
              <div>
                <h4>הערות הסגל:</h4>
                <ul>
                  {selectedRequest.staffComments.map((comment, idx) => (
                    <li key={idx}>
                      {comment.comment} -{" "}
                      {new Date(comment.date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="approve-button"
              onClick={() => handleApprove(selectedRequest._id)}
            >
              אישור
            </button>
            <button
              className="reject-button"
              onClick={() => handleReject(selectedRequest._id)}
            >
              דחה
            </button>
            <button
              className="close-button"
              onClick={() => setSelectedRequest(null)}
            >
              סגור
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;
