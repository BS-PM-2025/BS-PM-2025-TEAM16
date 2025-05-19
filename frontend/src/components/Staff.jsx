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
  const [allStaff, setAllStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    const data = getFromLocalStorage("projectFS");
    setUserData(data);

    if (data?.user?.username) {
      let url = `http://localhost:3006/api/staff/requests/by-status-and-staff?staffUsername=${data.user.username}&status=${statusFilter}`;

      if (studentIdFilter) {
        url = `http://localhost:3006/api/staff/requests/by-student-id?studentId=${studentIdFilter}`;
      }

      axios
        .get(url, {
          headers: { "user-role": "Staff" },
        })
        .then((res) => {
          setRequests(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error loading staff requests:", err);
          setIsLoading(false);
        });

      axios
        .get("http://localhost:3006/users/all-users")
        .then((res) => {
          const staffOnly = res.data.filter(
            (user) => user.role === "Staff" && user.username !== data.user.username
          );
          setAllStaff(staffOnly);
        })
        .catch((err) => console.error("Error loading users:", err));
    } else {
      setIsLoading(false);
    }
  }, [statusFilter, studentIdFilter]);

  const handleApprove = (id) => {
    axios
      .put(`http://localhost:3006/api/staff/requests/approve/${id}`)
      .then(() => {
        alert("הבקשה אושרה");
        updateRequestStatus(id, "אושר");
      })
      .catch(() => alert("שגיאה באישור הבקשה"));
  };

  const handleReject = (id) => {
    axios
      .put(`http://localhost:3006/api/staff/requests/reject/${id}`)
      .then(() => {
        alert("הבקשה נדחתה");
        updateRequestStatus(id, "נדחה");
      })
      .catch(() => alert("שגיאה בדחיית הבקשה"));
  };

  const handleTransfer = (id) => {
    if (!selectedStaff) {
      alert("אנא בחר איש סגל להעברה");
      return;
    }

    axios
      .put(`http://localhost:3006/api/staff/requests/transfer/${id}`, {
        newStaffId: selectedStaff,
      })
      .then(() => {
        alert("הבקשה הועברה בהצלחה");
        setRequests((prev) => prev.filter((req) => req._id !== id));
        setSelectedRequest(null);
      })
      .catch(() => alert("שגיאה בהעברת הבקשה"));
  };

  const updateRequestStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((req) => (req._id === id ? { ...req, status } : req))
    );
    setSelectedRequest((prev) => (prev ? { ...prev, status } : prev));
  };

  return (
    <div className="welcome" dir="rtl">
      <div className="welcome-page-container">
        <Header />
        {userData && (
          <div className="welcome-header-box">
            <h2>ברוך הבא לאזור האישי שלך {userData.user.username}</h2>
          </div>
        )}

        <div className="requests-box">
          <h3>בקשות סטודנטים לטיפולך:</h3>
          <div className="status-container">
            <label className="status-label">סינון לפי סטטוס:</label>
            <select
              className="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={studentIdFilter !== ""}
            >
              <option value="ממתין">ממתין</option>
              <option value="אושר">אושר</option>
              <option value="נדחה">נדחה</option>
            </select>
            <label className="status-label">הזן תעודת זהות לסינון:</label>
            <input
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

            <div style={{ marginTop: "1rem" }}>
              <label>העבר לאיש סגל אחר:</label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              >
                <option value="">בחר איש סגל</option>
                {allStaff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.firstname} {s.lastname}
                  </option>
                ))}
              </select>
              <button
                className="approve-button"
                onClick={() => handleTransfer(selectedRequest._id)}
              >
                העבר בקשה
              </button>
            </div>

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